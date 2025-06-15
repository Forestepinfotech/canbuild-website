import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userNameFilter'
})
export class UserNameFilterPipe implements PipeTransform {
    transform(user: any[], search: string): any[] {
        if (!user || !search) return user;
        const lowerSearch = search.toLowerCase();
        return user.filter(u =>
            u.UserName?.toLowerCase().includes(lowerSearch) ||
            u.UserFullName?.toLowerCase().includes(lowerSearch) ||
            u.EmailID?.toLowerCase().includes(lowerSearch) ||
            u.ContactNo?.toLowerCase().includes(lowerSearch) ||
            u.SecurityNumber?.toLowerCase().includes(lowerSearch)
        );
    }
}
