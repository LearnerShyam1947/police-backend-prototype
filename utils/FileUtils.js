const XLSX = require('xlsx');

function excelToJson(buffer, options = {}) {
    try {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetIndex = options.sheetIndex || 0;
        const sheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        // console.log(jsonData);
        
        return jsonData;    
    } catch (error) {
        throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
}

module.exports = excelToJson;
