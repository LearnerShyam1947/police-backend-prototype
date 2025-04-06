// generateExcel.js
const XLSX = require("xlsx");

const data = [
  {
    "Lat": 14.679235317132302,
    "Long": 77.60762669834641,
    "CGI": 5,
    "VLR": 5,
    "IMEI": 5,
    "IMSI": 5,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "7815082776",
  },
  {
    "Lat": 14.678523281014642,
    "Long": 77.59379242533158,
    "CGI": 3,
    "VLR": 3,
    "IMEI": 3,
    "IMSI": 3,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "9441081365",
  },
  {
    "Lat": 14.693443045725029,
    "Long": 77.59994064622662,
    "CGI": 7,
    "VLR": 7,
    "IMEI": 7,
    "IMSI": 7,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "9996665555",
  },
  {
    "Lat": 14.665926021322963,
    "Long": 77.58023110416724,
    "CGI": 2,
    "VLR": 2,
    "IMEI": 2,
    "IMSI": 2,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "7337545868",
  },
  {
    "Lat": 14.68044205167674,
    "Long": 77.59735364411882,
    "CGI": 4,
    "VLR": 4,
    "IMEI": 4,
    "IMSI": 4,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "8688746510",
  },
  {
    "Lat": 14.677235317132302,
    "Long": 77.60962669834641,
    "CGI": 6,
    "VLR": 6,
    "IMEI": 6,
    "IMSI": 6,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "8179143635",
  },
  {
    "Lat": 14.679823281014642,
    "Long": 77.59079242533158,
    "CGI": 8,
    "VLR": 8,
    "IMEI": 8,
    "IMSI": 8,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "7680936585",
  },
  {
    "Lat": 14.690443045725029,
    "Long": 77.59844064622662,
    "CGI": 1,
    "VLR": 1,
    "IMEI": 1,
    "IMSI": 1,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "9030673341",
  },
  {
    "Lat": 14.663026021322963,
    "Long": 77.58523110416724,
    "CGI": 9,
    "VLR": 9,
    "IMEI": 9,
    "IMSI": 9,
    "LBS Type": 'C',
    "Request ID": '1234',
    "L. Act. ": "05-04-2025 12:55:52",
    "MOB": "0",
  }
];

// Create a worksheet from the data
const ws = XLSX.utils.json_to_sheet(data);

// Create a new workbook and append the worksheet
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "CrimeRecords");

// Write the workbook to a file
// XLSX.writeFile(wb, "CrimeRecordsSample.xlsx");
XLSX.writeFile(wb, "test-beats.xlsx");

console.log("Excel file generated successfully!");

