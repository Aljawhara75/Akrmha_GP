export const  calculateDistance =(region, otherRegion) => {
    const earthRadius = 6371;
    
    const radLat1 = (Math.PI * region?.latitude) / 180;
    const radLon1 = (Math.PI * region?.longitude) / 180;
    const radLat2 = (Math.PI * otherRegion?.latitude) / 180;
    const radLon2 = (Math.PI * otherRegion?.longitude) / 180;

    // Haversine formula
    const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance.toFixed(2);
}
