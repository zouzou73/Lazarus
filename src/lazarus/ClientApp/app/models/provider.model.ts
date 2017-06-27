import { Utilities } from '../services/utilities';
import { User } from './user.model';
import { Gender } from './enums';



export class Provider {

    public static Create(data: {}) {
        let p = new Provider();
        Object.assign(p, data);

        if (p.dateOfBirth)
            p.dateOfBirth = Utilities.parseDate(p.dateOfBirth);

        if (p.applicationUser) {
            let appUser = new User();
            Object.assign(appUser, p.applicationUser);

            p.applicationUser = appUser;
        }

        return p
    }


    get friendlyName(): string {
        return this.applicationUser ? this.applicationUser.friendlyName : null;
    }

    public id: number;
    public serviceId: string;
    public workPhoneNumber: string;
    public address: string;
    public city: string;
    public gender: Gender;
    public dateOfBirth: Date;
    public applicationUserId: string;
    public applicationUser: User;
    public departmentId: number;
    public departmentName: string;
}