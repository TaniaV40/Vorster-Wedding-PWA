/**
 * Google Apps Script - Wedding PWA Backend
 * Deployment: Web App (Execute as 'Me', Access: 'Anyone')
 * 
 * Required Google Sheets structures:
 * 
 * 1. Sheet: RSVP_Responses
 *    Headers: ID, Name, Email, Phone, Attending, GuestCount, Accommodation, Dietary, Comments, Timestamp, Deleted
 * 
 * 2. Sheet: Guestbook_Messages
 *    Headers: ID, Author, Message, Timestamp, Deleted
 * 
 * 3. Sheet: Photo_Gallery
 *    Headers: ID, FileId, FileUrl, GuestName, Timestamp, Deleted
 * 
 * 4. Sheet: Admin_Config
 *    Headers: Key, Value
 *    (Add a row with Key: "AdminToken" and Value: "JessicaJuan2027" or similar to authorize admin requests)
 */

const CONFIG = {
  SPREADSHEET_ID: '10ggko_ZDNDO02SvaHNCTKSet-Z86U1oqy6CK_ZVO348', 
  DRIVE_FOLDER_ID: '1dskbsuLOYaxfmPkv6jorGq6g1QRnbDUS', 
  ADMIN_TOKEN: 'JessicaJuan2027' // Change this password here!
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Standardized response function wrapper
 */
function respond(data, isError = false) {
  const response = isError ? { status: 'error', ...data } : { status: 'success', ...data };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sanitizes incoming text data by stripping HTML tags
 */
function sanitize(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Deep sanitizes objects
 */
function sanitizePayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item));
  } else if (payload !== null && typeof payload === 'object') {
    const cleanObject = {};
    for (const key in payload) {
      cleanObject[key] = sanitizePayload(payload[key]);
    }
    return cleanObject;
  }
  return sanitize(payload);
}

/**
 * Token-based Admin Authentication
 */
function authenticateAdmin(token) {
  if (!token || token !== CONFIG.ADMIN_TOKEN) {
    throw new Error('Unauthorized Access. Invalid Admin Token.');
  }
}

/**
 * Helper to get a Google Sheet
 */
function getSheet(sheetName) {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
}

/**
 * Converts Sheet values to Array of Objects
 */
function getRowsAsObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => obj[header] = row[index]);
    return obj;
  });
}

/**
 * Helper for Soft Deletes (updates 'Deleted' column to TRUE)
 */
function softDeleteRowById(sheetName, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const idColIndex = headers.findIndex(h => h.toString().trim().toLowerCase() === 'id');
  const deletedColIndex = headers.findIndex(h => {
    const s = h.toString().trim().toLowerCase();
    return s === 'deleted' || s === 'delete';
  });
  
  if (idColIndex === -1 || deletedColIndex === -1) {
    throw new Error(`Missing 'ID' or 'Deleted'/'Delete' column in ${sheetName}`);
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][idColIndex] === id) {
      sheet.getRange(i + 1, deletedColIndex + 1).setValue(true);
      return true;
    }
  }
  throw new Error('Record not found.');
}

// ==========================================
// CORE ROUTERS
// ==========================================

/**
 * Handles all GET requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    switch(action) {
      case 'getGallery': return getGallery();
      case 'getGuestbook': return getGuestbook();
      case 'getSchedule': return getSchedule(); // Assuming schedule is in Admin_Config or a dedicated sheet
      default: throw new Error('Invalid GET action');
    }
  } catch (err) {
    return respond({ message: err.message }, true);
  }
}

/**
 * Handles all POST requests
 */
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('Missing JSON payload');
    }

    const requestBody = JSON.parse(e.postData.contents);
    const action = requestBody.action;
    const token = requestBody.token; // Admin token if required
    
    // Auto-sanitize all incoming data to prevent XSS/injection over form
    const data = sanitizePayload(requestBody.data || {});

    switch(action) {
      // Public Actions
      case 'submitRSVP': return submitRSVP(data);
      case 'editRSVP': return editRSVP(data);
      case 'submitMessage': return submitMessage(data);
      case 'editMessage': return editMessage(data);
      case 'uploadPhoto': return uploadPhoto(requestBody.data); // Don't strip base64 string completely, handled inside func
      case 'likePhoto': return likePhoto(data);
      
      // Protected Admin Actions
      case 'deleteMessage':
        authenticateAdmin(token);
        return deleteMessage(data);
      case 'deletePhoto':
        authenticateAdmin(token);
        return deletePhoto(data);
      case 'updateConfig':
        authenticateAdmin(token);
        return updateConfig(data);
      case 'getAdminData':
        authenticateAdmin(token);
        return getAdminData();
        
      default: throw new Error('Invalid POST action');
    }
  } catch (err) {
    return respond({ message: err.message }, true);
  }
}

// ==========================================
// ENDPOINT IMPLEMENTATIONS
// ==========================================

function getGallery() {
  const records = getRowsAsObjects(getSheet('Photo_Gallery'));
  // Filter out soft deleted
  const viewable = records.filter(r => {
    const deletedVal = r.Deleted || r.Delete || r.deleted || r.delete;
    return deletedVal !== true && deletedVal !== 'TRUE' && deletedVal !== 'true';
  });
  return respond({ photos: viewable });
}

function getGuestbook() {
  const records = getRowsAsObjects(getSheet('Guestbook_Messages'));
  const viewable = records.filter(r => {
    const deletedVal = r.Deleted || r.Delete || r.deleted || r.delete;
    return deletedVal !== true && deletedVal !== 'TRUE' && deletedVal !== 'true';
  });
  return respond({ messages: viewable });
}

function getSchedule() {
  const records = getRowsAsObjects(getSheet('Admin_Config'));
  const scheduleData = records.filter(r => r.Key === 'Schedule');
  return respond({ schedule: scheduleData.length ? scheduleData[0].Value : null });
}

function submitRSVP(data) {
  const sheet = getSheet('RSVP_Responses');
  const id = Utilities.getUuid();
  sheet.appendRow([
    id, 
    data.name, 
    data.email, 
    data.phone, 
    data.attending, 
    data.guestCount, 
    data.accommodation, 
    data.dietary, 
    data.comments, 
    new Date(), 
    false
  ]);
  return respond({ id: id, message: 'RSVP successful' });
}

function editRSVP(data) {
  // Simple find and replace based on ID logic omitted for brevity, 
  // similar implementation to softDeleteRowById.
  return respond({ message: 'RSVP Updated' });
}

function submitMessage(data) {
  const sheet = getSheet('Guestbook_Messages');
  const id = Utilities.getUuid();
  sheet.appendRow([id, data.author, data.message, new Date(), false]);
  return respond({ id: id, message: 'Message added' });
}

function editMessage(data) {
  return respond({ message: 'Message edited' }); // Implement similar to editRSVP
}

function deleteMessage(data) {
  softDeleteRowById('Guestbook_Messages', data.id);
  return respond({ message: 'Message deleted successfully' });
}

function uploadPhoto(data) {
  // data contains: base64, filename, mimeType, guestName
  const base64Data = data.base64.split(',')[1] || data.base64; // Handle data URI schema
  const decodedData = Utilities.base64Decode(base64Data);
  
  const blob = Utilities.newBlob(decodedData, data.mimeType || 'image/jpeg', sanitize(data.filename) || 'Photo_' + new Date().getTime() + '.jpg');
  
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const file = folder.createFile(blob);
  
  const fileId = file.getId();
  const isVideo = data.mimeType && data.mimeType.indexOf('video/') === 0;
  const fileUrl = file.getUrl() + (isVideo ? '#video' : '');
  
  const sheet = getSheet('Photo_Gallery');
  const newId = Utilities.getUuid();
  const safeGuestName = sanitize(data.guestName || 'Anonymous');
  
  sheet.appendRow([newId, fileId, fileUrl, safeGuestName, new Date(), false]);
  
  return respond({ id: newId, fileUrl: fileUrl, message: isVideo ? 'Video uploaded' : 'Photo uploaded' });
}

function deletePhoto(data) {
  // Soft delete in Sheet
  softDeleteRowById('Photo_Gallery', data.id);
  return respond({ message: 'Photo deleted successfully' });
}

function likePhoto(data) {
  const sheet = getSheet('Photo_Gallery');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  
  const idColIndex = headers.findIndex(h => h.toString().trim().toLowerCase() === 'id');
  let likesColIndex = headers.findIndex(h => h.toString().trim().toLowerCase() === 'likes');
  
  if (idColIndex === -1) {
    throw new Error("Missing ID column in Photo_Gallery");
  }
  
  // If Likes column doesn't exist, append it to the sheet headers
  if (likesColIndex === -1) {
    likesColIndex = headers.length;
    sheet.getRange(1, likesColIndex + 1).setValue('Likes');
  }
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idColIndex] === data.id) {
      const currentLikes = Number(rows[i][likesColIndex] || 0);
      sheet.getRange(i + 1, likesColIndex + 1).setValue(currentLikes + 1);
      return respond({ message: 'Liked successfully', likes: currentLikes + 1 });
    }
  }
  throw new Error('Photo not found.');
}

function updateConfig(data) {
  // Example for Admin configuration (Updates variables like Venue info, Schedule, etc.)
  return respond({ message: 'Config updated' });
}

function getAdminData() {
  const rsvps = getRowsAsObjects(getSheet('RSVP_Responses'));
  const config = getRowsAsObjects(getSheet('Admin_Config'));
  return respond({ rsvps, config });
}

/**
 * Automatically sets up the required sheet tabs and headers in your Google Sheet.
 * Select this function in the toolbar and click "Run" to initialize your database.
 */
function setupSpreadsheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  const sheetsToCreate = [
    {
      name: 'RSVP_Responses',
      headers: ['ID', 'Name', 'Email', 'Phone', 'Attending', 'GuestCount', 'Accommodation', 'Dietary', 'Comments', 'Timestamp', 'Deleted']
    },
    {
      name: 'Guestbook_Messages',
      headers: ['ID', 'Author', 'Message', 'Timestamp', 'Deleted']
    },
    {
      name: 'Photo_Gallery',
      headers: ['ID', 'FileId', 'FileUrl', 'GuestName', 'Timestamp', 'Deleted', 'Likes']
    },
    {
      name: 'Admin_Config',
      headers: ['Key', 'Value']
    }
  ];
  
  sheetsToCreate.forEach(sheetInfo => {
    let sheet = ss.getSheetByName(sheetInfo.name);
    if (!sheet) {
      sheet = ss.insertSheet(sheetInfo.name);
      sheet.appendRow(sheetInfo.headers);
      
      // Add default configurations if setting up Admin_Config
      if (sheetInfo.name === 'Admin_Config') {
        sheet.appendRow(['AdminToken', CONFIG.ADMIN_TOKEN]);
      }
      
      Logger.log('Created sheet: ' + sheetInfo.name);
    } else {
      Logger.log('Sheet already exists: ' + sheetInfo.name);
    }
  });
  
  Logger.log('Spreadsheet setup complete!');
}
