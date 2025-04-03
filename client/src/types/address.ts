export interface Address {
    nation: string;
    street: string;
    district: string;
    cityProvince: string;
    wardsCommunes: string;
}


export const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return "Chưa có địa chỉ";
    const addressParts = [
        address.street,
        address.wardsCommunes,
        address.district,
        address.cityProvince,
        address.nation
    ];
    return addressParts.filter(Boolean).join(', ');
};