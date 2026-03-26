export const rechargePlans = {
    // ── MOBILE ──
    airtel: [
        { id: 'a1', amount: 19, validity: '1 Day', data: '1GB', description: 'Data Pack', category: 'Data' },
        { id: 'a2', amount: 99, validity: '28 Days', data: 'None', description: 'Talktime ₹99 + 200MB', category: 'Smart' },
        { id: 'a3', amount: 155, validity: '24 Days', data: '1GB', description: 'Unlimited Voice + 300 SMS', category: 'Unlimited' },
        { id: 'a4', amount: 239, validity: '24 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Popular' },
        { id: 'a5', amount: 299, validity: '28 Days', data: '2GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Popular' },
        { id: 'a6', amount: 479, validity: '56 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Unlimited' },
        { id: 'a7', amount: 1799, validity: '365 Days', data: '24GB', description: 'Unlimited Voice + 3600 SMS', category: 'Annual' }
    ],
    jio: [
        { id: 'j1', amount: 15, validity: 'Existing', data: '1GB', description: 'Data Add-on', category: 'Data' },
        { id: 'j2', amount: 149, validity: '20 Days', data: '1GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Popular' },
        { id: 'j3', amount: 239, validity: '28 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Unlimited' },
        { id: 'j4', amount: 299, validity: '28 Days', data: '2GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: '5G' },
        { id: 'j5', amount: 666, validity: '84 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Popular' },
        { id: 'j6', amount: 749, validity: '90 Days', data: '2GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Unlimited' },
        { id: 'j7', amount: 2999, validity: '365 Days', data: '2.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Annual' }
    ],
    vi: [
        { id: 'v1', amount: 19, validity: '24 Hours', data: '1GB', description: 'Data Pack', category: 'Data' },
        { id: 'v2', amount: 98, validity: '21 Days', data: 'None', description: 'Unlimited Voice - No Data', category: 'Unlimited' },
        { id: 'v3', amount: 155, validity: '24 Days', data: '1GB', description: 'Unlimited Voice + 300 SMS', category: 'Unlimited' },
        { id: 'v4', amount: 299, validity: '28 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day + Hero', category: 'Popular' },
        { id: 'v5', amount: 479, validity: '56 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Popular' },
        { id: 'v6', amount: 719, validity: '84 Days', data: '1.5GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Unlimited' },
        { id: 'v7', amount: 1799, validity: '365 Days', data: '24GB', description: 'Unlimited Voice + 3600 SMS', category: 'Annual' }
    ],
    bsnl: [
        { id: 'b1', amount: 18, validity: '2 Days', data: '1GB/Day', description: 'Voice STV', category: 'STV' },
        { id: 'b2', amount: 97, validity: '15 Days', data: '2GB/Day', description: 'Unlimited Voice + Data', category: 'Popular' },
        { id: 'b3', amount: 118, validity: '20 Days', data: '0.5GB/Day', description: 'Unlimited Voice + PRBT', category: 'Unlimited' },
        { id: 'b4', amount: 153, validity: '26 Days', data: '1GB/Day', description: 'Unlimited Voice + PRBT', category: 'Popular' },
        { id: 'b5', amount: 199, validity: '30 Days', data: '2GB/Day', description: 'Unlimited Voice + 100 SMS/Day', category: 'Unlimited' },
        { id: 'b6', amount: 599, validity: '84 Days', data: '3GB/Day', description: 'Unlimited Voice + 100 SMS/Day + Zing', category: 'STV' },
        { id: 'b7', amount: 1999, validity: '365 Days', data: '600GB', description: 'Unlimited Voice + OTT Benefits', category: 'Annual' }
    ],

    // ── DTH ──
    tataplay: [
        { id: 'tp1', amount: 153, validity: '1 Month', data: 'None', description: 'Basic HD – 200+ Channels', category: 'Popular' },
        { id: 'tp2', amount: 199, validity: '1 Month', data: 'None', description: 'Smart Pack – 300+ Channels', category: 'Popular' },
        { id: 'tp3', amount: 249, validity: '1 Month', data: 'None', description: 'Value Pack + Disney+ Hotstar', category: 'Smart' },
        { id: 'tp4', amount: 349, validity: '1 Month', data: 'None', description: 'Premium – 350+ Channels + OTT', category: 'Unlimited' },
        { id: 'tp5', amount: 499, validity: '1 Month', data: 'None', description: 'Ultimate 4K + All OTT', category: 'Annual' },
        { id: 'tp6', amount: 1499, validity: '6 Months', data: 'None', description: 'Half-Yearly Value Pack', category: 'Smart' },
    ],
    airteldth: [
        { id: 'ad1', amount: 149, validity: '1 Month', data: 'None', description: 'Basic SD – 180 Channels', category: 'Popular' },
        { id: 'ad2', amount: 199, validity: '1 Month', data: 'None', description: 'Classic HD – 250 Channels', category: 'Popular' },
        { id: 'ad3', amount: 299, validity: '1 Month', data: 'None', description: 'Mega HD + Amazon Prime', category: 'Smart' },
        { id: 'ad4', amount: 399, validity: '1 Month', data: 'None', description: 'Super HD + All OTT Access', category: 'Unlimited' },
        { id: 'ad5', amount: 599, validity: '1 Month', data: 'None', description: 'Ultimate 4K + 400+ Channels', category: 'Annual' },
    ],
    dishtv: [
        { id: 'dt1', amount: 109, validity: '1 Month', data: 'None', description: 'Basic – 190 Channels', category: 'Popular' },
        { id: 'dt2', amount: 159, validity: '1 Month', data: 'None', description: 'Silver – 240 Channels', category: 'Popular' },
        { id: 'dt3', amount: 219, validity: '1 Month', data: 'None', description: 'Gold – 280 Channels', category: 'Smart' },
        { id: 'dt4', amount: 319, validity: '1 Month', data: 'None', description: 'Platinum HD – 300 Channels', category: 'Unlimited' },
        { id: 'dt5', amount: 449, validity: '1 Month', data: 'None', description: 'Diamond HD + Sports Pack', category: 'Annual' },
    ],
    d2h: [
        { id: 'd1', amount: 119, validity: '1 Month', data: 'None', description: 'Starter – 195 Channels', category: 'Popular' },
        { id: 'd2', amount: 169, validity: '1 Month', data: 'None', description: 'Family – 260 Channels', category: 'Popular' },
        { id: 'd3', amount: 239, validity: '1 Month', data: 'None', description: 'Super Value + HD Channels', category: 'Smart' },
        { id: 'd4', amount: 339, validity: '1 Month', data: 'None', description: 'Premium HD – 310 Channels', category: 'Unlimited' },
        { id: 'd5', amount: 499, validity: '1 Month', data: 'None', description: 'Elite HD + OTT Bundled', category: 'Annual' },
    ],

    // ── DATA CARD ──
    jiofi: [
        { id: 'jf1', amount: 119, validity: '20 Days', data: '40GB', description: 'JioFi Starter – 2Mbps', category: 'Popular' },
        { id: 'jf2', amount: 199, validity: '28 Days', data: '75GB', description: 'JioFi Value – 5G Ready', category: 'Popular' },
        { id: 'jf3', amount: 299, validity: '28 Days', data: '150GB', description: 'JioFi Premium – Unlimited', category: 'Unlimited' },
        { id: 'jf4', amount: 399, validity: '56 Days', data: '120GB', description: 'JioFi Extended Plan', category: 'Smart' },
        { id: 'jf5', amount: 999, validity: '90 Days', data: '330GB', description: 'JioFi Quarterly Bundle', category: 'Annual' },
    ],
    airtel4g: [
        { id: 'a4g1', amount: 149, validity: '28 Days', data: '30GB', description: 'Airtel 4G Basic Dongle', category: 'Popular' },
        { id: 'a4g2', amount: 249, validity: '28 Days', data: '75GB', description: 'Airtel 4G Value Pack', category: 'Popular' },
        { id: 'a4g3', amount: 349, validity: '28 Days', data: '150GB', description: 'Airtel 4G Unlimited', category: 'Unlimited' },
        { id: 'a4g4', amount: 599, validity: '60 Days', data: '120GB', description: 'Airtel 4G Double Validity', category: 'Smart' },
    ],
    vi_dongle: [
        { id: 'vd1', amount: 129, validity: '28 Days', data: '25GB', description: 'Vi Dongle Basic', category: 'Popular' },
        { id: 'vd2', amount: 229, validity: '28 Days', data: '60GB', description: 'Vi Dongle Value', category: 'Popular' },
        { id: 'vd3', amount: 349, validity: '28 Days', data: '100GB', description: 'Vi Dongle Premium', category: 'Unlimited' },
        { id: 'vd4', amount: 549, validity: '84 Days', data: '90GB', description: 'Vi Dongle Extended', category: 'Smart' },
    ],
    bsnl_evdo: [
        { id: 'be1', amount: 99, validity: '30 Days', data: '10GB', description: 'BSNL Broadband Starter', category: 'Popular' },
        { id: 'be2', amount: 199, validity: '30 Days', data: '30GB', description: 'BSNL High Speed Plan', category: 'Popular' },
        { id: 'be3', amount: 399, validity: '30 Days', data: '60GB', description: 'BSNL Unlimited Plan', category: 'Unlimited' },
        { id: 'be4', amount: 699, validity: '90 Days', data: '90GB', description: 'BSNL Quarterly Value', category: 'Annual' },
    ],

    // ── DEVICE ──
    iot_device: [
        { id: 'iot1', amount: 99, validity: '30 Days', data: 'None', description: 'IoT Basic Connectivity', category: 'Popular' },
        { id: 'iot2', amount: 199, validity: '30 Days', data: 'None', description: 'IoT Data + Voice Pack', category: 'Smart' },
        { id: 'iot3', amount: 499, validity: '90 Days', data: 'None', description: 'IoT Premium Quarterly', category: 'Unlimited' },
        { id: 'iot4', amount: 1499, validity: '365 Days', data: 'None', description: 'IoT Annual Pro Plan', category: 'Annual' },
    ],
    oxygen_concentrator: [
        { id: 'oc1', amount: 149, validity: '30 Days', data: 'None', description: 'Health Device Basic Plan', category: 'Popular' },
        { id: 'oc2', amount: 299, validity: '30 Days', data: 'None', description: 'Health Device Premium Monitor', category: 'Smart' },
        { id: 'oc3', amount: 799, validity: '90 Days', data: 'None', description: 'Health Device Quarterly Care', category: 'Unlimited' },
        { id: 'oc4', amount: 2499, validity: '365 Days', data: 'None', description: 'Health Device Annual Pro', category: 'Annual' },
    ],
    pos_terminal: [
        { id: 'pt1', amount: 199, validity: '30 Days', data: 'None', description: 'POS Starter – 500 transactions', category: 'Popular' },
        { id: 'pt2', amount: 399, validity: '30 Days', data: 'None', description: 'POS Business – 2000 transactions', category: 'Smart' },
        { id: 'pt3', amount: 799, validity: '30 Days', data: 'None', description: 'POS Enterprise – Unlimited', category: 'Unlimited' },
        { id: 'pt4', amount: 3999, validity: '365 Days', data: 'None', description: 'POS Annual Business Plan', category: 'Annual' },
    ],
    gps_tracker: [
        { id: 'gt1', amount: 99, validity: '30 Days', data: 'None', description: 'GPS Basic Tracking Plan', category: 'Popular' },
        { id: 'gt2', amount: 199, validity: '30 Days', data: 'None', description: 'GPS Live Tracking + Alerts', category: 'Smart' },
        { id: 'gt3', amount: 499, validity: '90 Days', data: 'None', description: 'GPS Fleet Quarterly Plan', category: 'Unlimited' },
        { id: 'gt4', amount: 1499, validity: '365 Days', data: 'None', description: 'GPS Enterprise Annual', category: 'Annual' },
    ],
};
