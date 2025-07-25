export interface CategoryProps {
    id?: string;
    user_id: string;
    name: string;
    color?: string;
    icon?: string;
    is_default?: boolean;
}
export declare class Category {
    id?: string;
    user_id: string;
    name: string;
    color?: string;
    icon?: string;
    is_default: boolean;
    constructor({ id, user_id, name, color, icon, is_default }: CategoryProps);
    toJSON(): {
        [key: string]: any;
    };
    private isValidHexColor;
    getContrastingTextColor(): string;
    static validate(props: CategoryProps): {
        isValid: boolean;
        errors: string[];
    };
    static createDefaultCategories(user_id: string): Category[];
    static getColorPalette(): string[];
    static getCommonIcons(): string[];
}
