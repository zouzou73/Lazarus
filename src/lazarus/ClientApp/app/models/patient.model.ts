import { Utilities } from '../services/utilities';
import { User } from './user.model';
import { Gender, BloodGroup } from './enums';



export class Patient {

    private minDate = new Date(0);

    public static Create(data: {}) {
        let p = new Patient();
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


    get age(): number {
        if (this.dateOfBirth > this.minDate)
            return Utilities.getAge(this.dateOfBirth, new Date());
    }


    public id: number;
    public bloodGroup: BloodGroup;
    public address: string;
    public city: string;
    public gender: Gender;
    public dateOfBirth: Date;
    public applicationUserId: string;
    public applicationUser: User;
}