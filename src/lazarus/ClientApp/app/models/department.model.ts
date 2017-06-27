export class Department {

    constructor(name?: string, description?: string, icon?: string) {

        this.name = name;
        this.description = description;
        this.icon = icon;
    }

    public id: number;
    public name: string;
    public description: string;
    public icon: string;
    public usersCount: number;
}