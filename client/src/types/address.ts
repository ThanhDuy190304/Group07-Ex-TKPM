export interface Address {
    nation: string;
    street: string;
    district: string;
    city_province: string;
    wards_communes: string;
}


export const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return "Chưa có địa chỉ";
    const addressParts = [
        address.street,
        address.wards_communes,
        address.district,
        address.city_province,
        address.nation
    ];
    return addressParts.filter(Boolean).join(', ');
};