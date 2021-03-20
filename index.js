var csvParser = require("csv-parse");
var fs = require("fs");
const parse = require('csv-parse/lib/sync')
const transform = require('stream-transform/lib/sync')
const stringify = require('csv-stringify')
var iconv = require('iconv-lite');


// console.log(process.argv[2]);

let strArr = fs.readFileSync(process.argv[2], "utf-8").split("\n");

let csvArr = strArr.splice(4, strArr.length - 6)

let csvStr = csvArr.join("\n");

const records = parse(csvStr, {
    columns: true,
    skip_empty_lines: true
})

let exportDatas = [];

records.forEach(element => {

    element.d = parseFloat(element.d);
    element.rx = parseFloat(element.rx);
    element.y = parseFloat(element.y);

    // element.d = element.d * 0.3;
    // element.y = element.y - 0.3;
    // element.rx = element.rx - 20;

    var am = {
        Motion: element.Camera,
        bone: "アーム",
        x: 0,
        y: 0,
        z: element.d,
        rx: 0,
        ry: 0,
        rz: 0,
        x_p1x: 20,
        x_p1y: 20,
        x_p2x: 107,
        x_p2y: 107,
        y_p1x: 20,
        y_p1y: 20,
        y_p2x: 107,
        y_p2y: 107,
        z_p1x: element.z_p1x,
        z_p1y: element.z_p1y,
        z_p2x: element.z_p2x,
        z_p2y: element.z_p2y,
        r_p1x: 20,
        r_p1y: 20,
        r_p2x: 107,
        r_p2y: 107
    };
    var center = {
        Motion: element.Camera,
        bone: "センター",
        x: element.x,
        y: element.y,
        z: element.z,
        rx: -element.rx, //0
        ry: -element.ry,
        rz: element.rz, //0,
        x_p1x: element.x_p1x,
        x_p1y: element.x_p1y,
        x_p2x: element.x_p2x,
        x_p2y: element.x_p2y,
        y_p1x: element.y_p1x,
        y_p1y: element.y_p1y,
        y_p2x: element.y_p2x,
        y_p2y: element.y_p2y,
        z_p1x: 20,
        z_p1y: 20,
        z_p2x: 107,
        z_p2y: 107,
        r_p1x: 20,
        r_p1y: 20,
        r_p2x: 107,
        r_p2y: 107
    };
    exportDatas.push(am);
    exportDatas.push(center);

});

console.log(records);

console.log(exportDatas);


let prefix = `Vocaloid Motion Data 0002\n視点ボーン\n`;

let endfix = `0,全ての親,0,0,0,0,0,0,20,20,107,107,20,20,107,107,20,20,107,107,20,20,107,107
0,視点ボーン,0,0,0,0,0,0,20,20,107,107,20,20,107,107,20,20,107,107,20,20,107,107
0,視点-右目,0,0,0,0,0,0,20,20,107,107,20,20,107,107,20,20,107,107,20,20,107,107
0,視点-左目,0,0,0,0,0,0,20,20,107,107,20,20,107,107,20,20,107,107,20,20,107,107
Expression,name,fact
0,カメラ表示,0
0,視差広く+0.1,0
0,視差広く+0.2,0
0,視差狭く-0.1,0
0,視差狭く-0.2,0
Camera,d,a,x,y,z,rx,ry,rz,x_p1x,x_p1y,x_p2x,x_p2y,y_p1x,y_p1y,y_p2x,y_p2y,z_p1x,z_p1y,z_p2x,z_p2y,r_p1x,r_p1y,r_p2x,r_p2y,d_p1x,d_p1y,d_p2x,d_p2y,a_p1x,a_p1y,a_p2x,a_p2y
Light,r,g,b,x,y,z`;


stringify(exportDatas, {
    header: true,
    cast: {
        date: function (value) {
            return value.toISOString()
        }
    }
}, function (err, data) {
    console.log(prefix + data + endfix)
    let result = prefix + data + endfix;

    var encoded = iconv.encode(result, 'shiftjis');
    fs.writeFileSync("result.csv", encoded);
})