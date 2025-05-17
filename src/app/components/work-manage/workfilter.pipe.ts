import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'workMultiFilter'
})
export class WorkrMultiFilterPipe implements PipeTransform {
    transform(work: any[], workName: string, jobName: string): any[] {
        if (!work) return [];

        const workname = workName?.toLowerCase() || '';
        const jobname = jobName?.toLowerCase() || '';

        return work.filter(i => {
            const matchesName =
                i.JobName?.toLowerCase().includes(jobname)

            const matchesCompany =
                i.WorkSubject?.toLowerCase().includes(workname);

            return matchesName && matchesCompany;
        });
    }
}
