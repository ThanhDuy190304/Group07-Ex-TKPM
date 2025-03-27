export interface Address {
    nation: string;
    street: string;
    district: string;
    city_province: string;
    wards_communes: string;
}


export const formatAddress = (address: Address): string => {
    return [
        address.street,
        address.wards_communes,
        address.district,
        address.city_province,
        address.nation
    ]
        .filter(Boolean) // Bỏ qua các phần tử rỗng
        .join(', ');     // Nối bằng dấu phẩy
};