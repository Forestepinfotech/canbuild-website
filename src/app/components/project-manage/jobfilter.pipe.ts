import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'jobNameFilter'
})
export class JobNameFilterPipe implements PipeTransform {
    transform(jobs: any[], search: string): any[] {
        if (!jobs || !search) return jobs;
        const lowerSearch = search.toLowerCase();
        return jobs.filter(job =>
            job.JobName.toLowerCase().includes(lowerSearch)
        );
    }
}
