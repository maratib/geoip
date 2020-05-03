'use strict';

const fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader;

export default class GeoipService {
	constructor() {
		this.cityReader = Reader.openBuffer(fs.readFileSync('./db/GeoLite2-City.mmdb'));

	}

	errorMsg(error, res) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify(error));
	}
	send(obj, res) {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(obj));
	}

	setName(obj, name, value) {
		// console.log(`${name} - ${value}`);

		if (typeof (value) == 'undefined') {
			obj[name] = null;
		} else {
			obj[name] = value;
		}
		return obj;
	}

	async getASN(ip, res) {
		Reader.open('./db/GeoLite2-ASN.mmdb').then(reader => {
			const response = reader.asn(ip);
			var obj = {
				val1: response.autonomousSystemNumber,
				val2: response.autonomousSystemOrganization
			};
			this.send(obj, res);

		}).catch(error => { this.errorMsg(error, res); });

	}

	async getCity(ip, res) {

		try {
			let data = await this.cityReader.city(ip);
			var city = {
				continent: null, country: null, isoCode: null, province: null, city: null, location: null,
			};

			city.continent = data?.continent?.names?.en ? data.continent.names.en : null;
			city.country = data?.country?.names?.en ? data.country.names.en : null;
			city.province = data?.subdivisions[0]?.names?.en ? data.subdivisions[0].names.en : null;
			city.isoCode = data?.country?.isoCode ? data.country.isoCode : null;
			city.city = data?.city?.names?.en ? data.city.names.en : null;
			city.location = data?.location ? data.location : null;
			this.send(city, res);
		} catch (err) {
			this.errorMsg(err, res);
		}
	}
}