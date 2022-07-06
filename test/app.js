const convert = require('xml-js');
const fs = require('fs');
// read file
const profilesFile = fs.readFileSync('./CuttingProfiles.xml', 'utf8');

// parse xml file as a json object
const profilesData = JSON.parse(convert.xml2json(profilesFile, {compact: true, spaces: 2}));
const obj = profilesData.root.CuttingProfiles.CuttingProfile
let arr = []
for (const i in obj)  {
	arr.push(`<Substrate>\n	<Name>${obj[i]._attributes.Name}</Name>\n</Substrate>\n`);
};
for(let i=0; i < arr.length; i++) {
 arr[i] = arr[i].replace('[', '');
 arr[i] = arr[i].replace(']', '');
 arr[i] = arr[i].replace(' ', '');
}
const res = (`<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n${arr.join("")}</Root>`)

fs.writeFile('./materials_test.xml', res, 'utf8',function (err) {
  if (err) return console.log(err);
  console.log("Write ok")
});
