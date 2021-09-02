import { binData } from './index';

describe('Visualization', () => {
    it('binData should work', () => {

        const data = {
            '0.3': 50,
            '0.6': 30,
            '0.9': 85
        };

        const binnedData = binData(data, 3, 2);
        expect(binnedData).toEqual({
            "0.3": 0.36363636363636365,
            "0.45": 0.36363636363636365,
            "0.6": 0,
            "0.75": 0,
            "0.9": 1,
            "1.05": 1
        });

        const data2 = {
            '0.3': 50,
            '0.6': 30,
            '0.9': 85,
            '1.20': 85
        };

        const binnedData2 = binData(data2, 4, 2);
        expect(binnedData2).toEqual({
            "0.3": 0.36363636363636365,
            "0.45": 0.36363636363636365,
            "0.6": 0,
            "0.75": 0,
            "0.9": 1,
            "1.05": 1,
            "1.2": 1,
            "1.35": 1,
        });

        const data3 = { 0: -32.756, 1: -34.286, 2: -30.944, 3: -27.246, 4: -29.851, 5: -34.051, 6: -31.411, 7: -33.685, 8: -25.231 };
        const binnedData3 = binData(data3, 3, 2);
        expect(binnedData3).toEqual({
            "0": 0.16896742131419104,
            "1.5": 0.16896742131419104,
            "3": 0.7774710104914412,
            "4.5": 0.7774710104914412,
            "6": 0.3175041413583655,
            "7.5": 0.3175041413583655,
        });
    });

    it('should bin properly', () => {
        const data4 = {
            "0": -60,
            "1": -22.311,
            "2": -26.132,
            "3": -18.913,
            "4": -14.603,
            "5": -14.927,
            "6": -14.415,
            "7": -14.745,
            "8": -14.849,
            "9": -17.562,
            "10": -22.795,
            "11": -22.403,
            "12": -22.672,
            "13": -18.91,
            "14": -26.155,
            "15": -15.178,
            "16": -14.192,
            "17": -3.363,
            "18": -15.608,
            "19": -3.284,
            "20": -3.263,
            "21": -3.599,
            "22": -3.196,
            "23": -3.422,
            "24": -13.999,
            "25": -14.63,
            "26": -13.819,
            "27": -13.07,
            "28": -14.652,
            "29": -13.212,
            "30": -14.554,
            "31": -11.9,
            "32": -20.798,
            "33": -19.78,
            "34": -16.16,
            "35": -23.061,
            "36": -21.252,
            "37": -22.833,
            "38": -20.571,
            "39": -21.16,
            "40": -16.084,
            "41": -22.719,
            "42": -22.144,
            "43": -18.439,
            "44": -16.916,
            "45": -20.589,
            "46": -20.077,
            "47": -18.911,
            "48": -14.4,
            "49": -19.148,
            "50": -15.586,
            "51": -21.656,
            "52": -16.517,
            "53": -21.638,
            "54": -16.544,
            "55": -15.341,
            "56": -15.606,
            "57": -13.741,
            "58": -15.413,
            "59": -15.044,
            "60": -14.551,
            "61": -15.797,
            "62": -14.349,
            "63": -13.208,
            "64": -10.119,
            "65": -12.571,
            "66": -14.952,
            "67": -12.495,
            "68": -21.875,
            "69": -12.581,
            "70": -20.219,
            "71": -16.493,
            "72": -20.423,
            "73": -16.37,
            "74": -16.673,
            "75": -15.83,
            "76": -21.093,
            "77": -10.479,
            "78": -10.2,
            "79": -3.363,
            "80": -3.391,
            "81": -3.082,
            "82": -3.517,
            "83": -3.403,
            "84": -13.699,
            "85": -3.414,
            "86": -14.315,
            "87": -9.506,
            "88": -11.273,
            "89": -9.814,
            "90": -10.111,
            "91": -9.512,
            "92": -11.057,
            "93": -6.798,
            "94": -9.316,
            "95": -13.965,
            "96": -13.146,
            "97": -14.061,
            "98": -14.104,
            "99": -21.105,
            "100": -17.323,
            "101": -9.604,
            "102": -10.332,
            "103": -10.179,
            "104": -11.284,
            "105": -9.623,
            "106": -7.99,
            "107": -15.377,
            "108": -10.253,
            "109": -9.455,
            "110": -3.931,
            "111": -3.904,
            "112": -3.495,
            "113": -3.767,
            "114": -4.028,
            "115": -9.9,
            "116": -3.784,
            "117": -10.258,
            "118": -11.455,
            "119": -9.589,
            "120": -9.559,
            "121": -9.767,
            "122": -12.659,
            "123": -9.244,
            "124": -6.953,
            "125": -5.948,
            "126": -9.516,
            "127": -8.45,
            "128": -7.669,
            "129": -5.62,
            "130": -9.512,
            "131": -8.418,
            "132": -10.518,
            "133": -9.221,
            "134": -10.205,
            "135": -9.364,
            "136": -9.414,
            "137": -4.09,
            "138": -10.495,
            "139": -8.294,
            "140": -9.796,
            "141": -11.933,
            "142": -10.847,
            "143": -15.12,
            "144": -10.643,
            "145": -11.569,
            "146": -11.131,
            "147": -11.583,
            "148": -15.02,
            "149": -14.38,
            "150": -13.597,
            "151": -15.285,
            "152": -16.66,
            "153": -16.514,
            "154": -16.26,
            "155": -6.406,
            "156": -11.797,
            "157": -7.542,
            "158": -11.924,
            "159": -7.011,
            "160": -11.586,
            "161": -6.774,
            "162": -12.138,
            "163": -7.96,
            "164": -11.066,
            "165": -9.168,
            "166": -17.333,
            "167": -14.77,
            "168": -11.461,
            "169": -5.78,
            "170": -12.956,
            "171": -3.536,
            "172": -2.939,
            "173": -3.441,
            "174": -3.888,
            "175": -3.644,
            "176": -3.443,
            "177": -9.365,
            "178": -8.88,
            "179": -9.908,
            "180": -9.029,
            "181": -9.012,
            "182": -8.897,
            "183": -10.089,
            "184": -6.685,
            "185": -8.638,
            "186": -6.237,
            "187": -7.612,
            "188": -6.639,
            "189": -14.616,
            "190": -7.323,
            "191": -13.998,
            "192": -10.203,
            "193": -8.671,
            "194": -10.637,
            "195": -8.744,
            "196": -9.898,
            "197": -9.463,
            "198": -8.884,
            "199": -7.629,
            "200": -11.027,
            "201": -9.842,
            "202": -4.229,
            "203": -3.621,
            "204": -3.315,
            "205": -3.588,
            "206": -3.896,
            "207": -7.388,
            "208": -8.756,
            "209": -8.085,
            "210": -9.578,
            "211": -7.657,
            "212": -8.797,
            "213": -7.428,
            "214": -8.458,
            "215": -6,
            "216": -9.396,
            "217": -6.485,
            "218": -6.939,
            "219": -6.13,
            "220": -7.395,
            "221": -6.9,
            "222": -6.403,
            "223": -8.491,
            "224": -7.984,
            "225": -8.74,
            "226": -8.603,
            "227": -9.591,
            "228": -7.376,
            "229": -7.885,
            "230": -4.221,
            "231": -4.451,
            "232": -3.891,
            "233": -3.996,
            "234": -3.835,
            "235": -3.793,
            "236": -8.664,
            "237": -6.732,
            "238": -9.154,
            "239": -7.704,
            "240": -9.032,
            "241": -6.831,
            "242": -6.411,
            "243": -7.47,
            "244": -6.465,
            "245": -10.815,
            "246": -6.921,
            "247": -7.014,
            "248": -6.97,
            "249": -9.835,
            "250": -5.414,
            "251": -10.142,
            "252": -8.071,
            "253": -7.347,
            "254": -9.701,
            "255": -7.619,
            "256": -4.589,
            "257": -7.443,
            "258": -6.456,
            "259": -7.227,
            "260": -3.277,
            "261": -3.887,
            "262": -3.587,
            "263": -3.951,
            "264": -3.39,
            "265": -3.491,
            "266": -6.93,
            "267": -6.93,
            "268": -6.031,
            "269": -6.901,
            "270": -6.22,
            "271": -5.811,
            "272": -5.111,
            "273": -6.491,
            "274": -6.055,
            "275": -6.449,
            "276": -7.187,
            "277": -6.188,
            "278": -5.372,
            "279": -6.969,
            "280": -9.575,
            "281": -10.513,
            "282": -6.186,
            "283": -7.69,
            "284": -6.622,
            "285": -7.539,
            "286": -6.369,
            "287": -5.329,
            "288": -3.572,
            "289": -7.478,
            "290": -3.223,
            "291": -2.304,
            "292": -3.874,
            "293": -3.174,
            "294": -3.906,
            "295": -14.299,
            "296": -7.806,
            "297": -14.077,
            "298": -6.968,
            "299": -7.71,
            "300": -15.415,
            "301": -7.789,
            "302": -7.857,
            "303": -7.24,
            "304": -6.754,
            "305": -8.197,
            "306": -5.912,
            "307": -7.406,
            "308": -6.857,
            "309": -7.421,
            "310": -6.845,
            "311": -9.945,
            "312": -5.667,
            "313": -10.21,
            "314": -14.227,
            "315": -10.184,
            "316": -7.879,
            "317": -11.775,
            "318": -6.361,
            "319": -11.142,
            "320": -7.099,
            "321": -6.759,
            "322": -7.242,
            "323": -6.015,
            "324": -6.45,
            "325": -6.314,
            "326": -6.721,
            "327": -6.721,
            "328": -6.721,
            "329": -6.721
        }
        const samples = Object.keys(data4);

        for (let i = 0; i < samples.length; i++) {
            if (samples[i + 1] && (+samples[i + 1] - +samples[i]) != 1) {
                console.log(i)
            }
        }

        const binnedData4 = binData(data4, 100, 2);


        expect(binnedData4).toEqual({
            "0": 0,
            "1.65": 0,
            "100.65": 0.6741368552412645,
            "102.3": 0.8608569051580699,
            "103.95": 0.8608569051580699,
            "105.6": 0.901448973932335,
            "107.25": 0.901448973932335,
            "108.9": 0.8760572656683305,
            "11.55": 0.6448453965612867,
            "110.55": 0.8760572656683305,
            "112.2": 0.9793573211314476,
            "113.85": 0.9793573211314476,
            "115.5": 0.8683444259567388,
            "117.15": 0.8683444259567388,
            "118.8": 0.8737347476428176,
            "120.45": 0.8737347476428176,
            "122.1": 0.8205248197448697,
            "123.75": 0.8205248197448697,
            "125.4": 0.9368413754853022,
            "127.05": 0.9368413754853022,
            "128.7": 0.942526344980588,
            "13.2": 0.7121810870770937,
            "130.35": 0.942526344980588,
            "132": 0.8576331114808652,
            "133.65": 0.8576331114808652,
            "135.3": 0.8776344980587909,
            "136.95": 0.8776344980587909,
            "138.6": 0.8961799778147532,
            "14.85": 0.7121810870770937,
            "140.25": 0.8961799778147532,
            "141.9": 0.8519308097615086,
            "143.55": 0.8519308097615086,
            "145.2": 0.8394169439822518,
            "146.85": 0.8394169439822518,
            "148.5": 0.7796034387132557,
            "150.15": 0.7796034387132557,
            "151.8": 0.7511785912368275,
            "153.45": 0.7511785912368275,
            "155.1": 0.9289032168607876,
            "156.75": 0.9289032168607876,
            "158.4": 0.8332640044370494,
            "16.5": 0.7939545202440377,
            "160.05": 0.8332640044370494,
            "161.7": 0.8295549084858569,
            "163.35": 0.8295549084858569,
            "165": 0.8810316139767055,
            "166.65": 0.8810316139767055,
            "168.3": 0.841288824181919,
            "169.95": 0.841288824181919,
            "171.6": 0.9889940377149196,
            "173.25": 0.9889940377149196,
            "174.9": 0.9767748197448697,
            "176.55": 0.9767748197448697,
            "178.2": 0.8860232945091514,
            "179.85": 0.8860232945091514,
            "18.15": 0.7939545202440377,
            "181.5": 0.8837354409317804,
            "183.15": 0.8837354409317804,
            "184.8": 0.8902176927343317,
            "186.45": 0.8902176927343317,
            "188.1": 0.9248648086522463,
            "189.75": 0.9248648086522463,
            "19.8": 0.9833783971159179,
            "191.4": 0.7973169717138103,
            "193.05": 0.7973169717138103,
            "194.7": 0.8883804769828064,
            "196.35": 0.8883804769828064,
            "198": 0.8859539656128674,
            "199.65": 0.8859539656128674,
            "201.3": 0.8693496949528563,
            "202.95": 0.8693496949528563,
            "204.6": 0.9777454242928453,
            "206.25": 0.9777454242928453,
            "207.9": 0.8881724902939545,
            "209.55": 0.8881724902939545,
            "21.45": 0.9833783971159179,
            "211.2": 0.9072206045479756,
            "212.85": 0.9072206045479756,
            "214.5": 0.8933374930671104,
            "216.15": 0.8933374930671104,
            "217.8": 0.9196651414309485,
            "219.45": 0.9196651414309485,
            "221.1": 0.9203410981697171,
            "222.75": 0.9203410981697171,
            "224.4": 0.9015529672767609,
            "226.05": 0.9015529672767609,
            "227.7": 0.9120909595119245,
            "229.35": 0.9120909595119245,
            "23.1": 0.98062257348863,
            "231": 0.9627877149195785,
            "232.65": 0.9627877149195785,
            "234.3": 0.97346436494731,
            "235.95": 0.97346436494731,
            "237.6": 0.8812742651136994,
            "239.25": 0.8812742651136994,
            "24.75": 0.98062257348863,
            "240.9": 0.9215370216306157,
            "242.55": 0.9215370216306157,
            "244.2": 0.927880615640599,
            "245.85": 0.927880615640599,
            "247.5": 0.918365224625624,
            "249.15": 0.918365224625624,
            "250.8": 0.8641500277315585,
            "252.45": 0.8641500277315585,
            "254.1": 0.8717935385468664,
            "255.75": 0.8717935385468664,
            "257.4": 0.9109297004991681,
            "259.05": 0.9109297004991681,
            "26.4": 0.8004194398225181,
            "260.7": 0.9725630892956184,
            "262.35": 0.9725630892956184,
            "264": 0.9811772046589018,
            "265.65": 0.9811772046589018,
            "267.3": 0.9198211314475874,
            "268.95": 0.9198211314475874,
            "270.6": 0.9392158901830283,
            "272.25": 0.9392158901830283,
            "273.9": 0.9349868275097061,
            "275.55": 0.9349868275097061,
            "277.2": 0.932681641708264,
            "278.85": 0.932681641708264,
            "28.05": 0.8004194398225181,
            "280.5": 0.8739773987798114,
            "282.15": 0.8739773987798114,
            "283.8": 0.9251594564614531,
            "285.45": 0.9251594564614531,
            "287.1": 0.9475700221852468,
            "288.75": 0.9475700221852468,
            "29.7": 0.7876802551303383,
            "290.4": 0.9840716860787576,
            "292.05": 0.9840716860787576,
            "293.7": 0.9722337770382695,
            "295.35": 0.9722337770382695,
            "297": 0.7959477260122019,
            "298.65": 0.7959477260122019,
            "3.3": 0.7121290904048807,
            "300.3": 0.7727572102052135,
            "301.95": 0.7727572102052135,
            "303.6": 0.9228716028840821,
            "305.25": 0.9228716028840821,
            "306.9": 0.9115709927897948,
            "308.55": 0.9115709927897948,
            "31.35": 0.7876802551303383,
            "310.2": 0.9212943704936217,
            "311.85": 0.9212943704936217,
            "313.5": 0.862971436494731,
            "315.15": 0.862971436494731,
            "316.8": 0.8358465058236273,
            "318.45": 0.8358465058236273,
            "320.1": 0.9168919855795896,
            "321.75": 0.9168919855795896,
            "323.4": 0.9356801164725458,
            "325.05": 0.9356801164725458,
            "326.7": 0.9234435662784248,
            "328.35": 0.9234435662784248,
            "33": 0.69710205213533,
            "34.65": 0.69710205213533,
            "36.3": 0.6715890183028286,
            "37.95": 0.6715890183028286,
            "39.6": 0.7611619523017193,
            "4.95": 0.7121290904048807,
            "41.25": 0.7611619523017193,
            "42.9": 0.7203445646145313,
            "44.55": 0.7203445646145313,
            "46.2": 0.6919543815862451,
            "47.85": 0.6919543815862451,
            "49.5": 0.7080560177481975,
            "51.15": 0.7080560177481975,
            "52.8": 0.6648987798114254,
            "54.45": 0.6648987798114254,
            "56.1": 0.769446755407654,
            "57.75": 0.769446755407654,
            "59.4": 0.7791874653355518,
            "6.6": 0.7843698003327787,
            "61.05": 0.7791874653355518,
            "62.7": 0.8110094287298946,
            "64.35": 0.8110094287298946,
            "66": 0.7807820299500832,
            "67.65": 0.7807820299500832,
            "69.3": 0.8218767332224071,
            "70.95": 0.8218767332224071,
            "72.6": 0.7562049362174155,
            "74.25": 0.7562049362174155,
            "75.9": 0.6743448419301165,
            "77.55": 0.6743448419301165,
            "79.2": 0.9816451747088186,
            "8.25": 0.7843698003327787,
            "80.85": 0.9816451747088186,
            "82.5": 0.9789760122018858,
            "84.15": 0.9789760122018858,
            "85.8": 0.7918226566833056,
            "87.45": 0.7918226566833056,
            "89.1": 0.8698349972268441,
            "9.9": 0.6448453965612867,
            "90.75": 0.8698349972268441,
            "92.4": 0.8482910427066002,
            "94.05": 0.8482910427066002,
            "95.7": 0.8120840266222962,
            "97.35": 0.8120840266222962,
            "99": 0.6741368552412645
        });
    });
});

export { };