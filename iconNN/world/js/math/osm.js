const Osm = {
    parseRoads: (data) => {
        const nodes = data.elements.filter((n) => n.type == "node");
        
        // SCALING LAT AND LON:
        // we need to scale the lon and lat because
        // the earth is too big where the decimals 
        // matter and will create big different
        const lats = nodes.map(n => n.lat);
        const lons = nodes.map(n => n.lon);

        const minLat = Math.min(...lats);
        const minLon = Math.min(...lons);
        const maxLat = Math.max(...lats);
        const maxLon = Math.max(...lons);

        const deltaLat = maxLat - minLat;
        const deltaLon = maxLon - minLon;
        const ar = deltaLon / deltaLat;
        // the distance in meter between latitudes line are always the same
        // but the distance between longitude changes while latitude changes
        // and it will change by half
        // one degree in equator can be the same
        // but one degree in north pole can be huge change
        // so the formula for scaling should be EarthRadius*cos(theta)
        const height = deltaLat * 111000 * 10; // length of 1 segment in pixel = 10 meter in real world 
        const width = height * ar * Math.cos(degToRad(maxLat));

        const points = [];
        const segments = [];
        for (const node of nodes) {
            const y = invLerp(maxLat, minLat, node.lat) * height;
            const x = invLerp(minLon, maxLon, node.lon) * width;
            const point = new Point(x, y);
            point.id = node.id;
            points.push(point);
        }

        const ways = data.elements.filter((w) => w.type == "way");
        for (const way of ways) {
            const ids = way.nodes;
            for (let i = 1; i < ids.length; i++) {
                const prev = points.find((p) => p.id == ids[i-1]);
                const curr = points.find((p) => p.id == ids[i]);
                // check oneWay
                const oneWay = way.tags.oneway || way.tags.lanes == 1;
                segments.push(new Segment(prev, curr, oneWay));
            }
        }
        console.log(ways);

        return {points, segments};
    }
}