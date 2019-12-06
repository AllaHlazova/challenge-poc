import {Component, OnInit} from '@angular/core';
import {FeathersService} from '../shared/feathers.service';
import {DataService, JobsModel, ModelType, UserModel} from '../services/data.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Paginated} from '@feathersjs/feathers';
import {MatTableDataSource} from '@angular/material/table';

export type Button = 'ADD' | 'UPDATE';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  private service: DataService = new DataService(this.feathers);
  public displayedColumns: string[] = ['id', 'title', 'description', 'createdAt', 'updatedAt', 'options'];
  public buttonStatus: Button = 'ADD';
  public selectedItemId: number;
  public jobsData: MatTableDataSource<JobsModel> = new MatTableDataSource<JobsModel>([]);

  informationControl: FormGroup = new FormGroup(
    {
      title: new FormControl(''),
      description: new FormControl('')
    }
  );

  constructor(private feathers: FeathersService) {
  }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.service.getData(ModelType.Job).then((value: Paginated<JobsModel>) => {
      this.jobsData = new MatTableDataSource<JobsModel>(value.data);
    });  }

  public formReset(): void {
    this.selectedItemId = null;
    this.informationControl.reset();
    this.buttonStatus = 'ADD';
  }

  public addJob(): void {
    const job: JobsModel = {
      ...this.informationControl.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.service.addData(job, ModelType.Job).then((newJob: JobsModel) => {
      this.jobsData.data.push(newJob);
      this.jobsData = new MatTableDataSource<JobsModel>(this.jobsData.data);
    });
    this.formReset();
  }

  public deleteJob(id): void {
    this.service.deleteData(id, ModelType.Job).then((deletedJob: JobsModel) => {
      const jobsInd: number = this.jobsData.data.findIndex((jobsData: JobsModel) => jobsData.id === deletedJob.id);
      this.jobsData.data.splice(jobsInd, 1);
      this.jobsData = new MatTableDataSource<JobsModel>(this.jobsData.data);
    });
  }

  public setData(element): void {
    const updateFields: string[] = [
      'title',
      'description'
    ];
    updateFields.forEach((field: string) => {
      this.informationControl.controls[field].setValue(element[field]);
    });
    this.selectedItemId = element.id;
    this.buttonStatus = 'UPDATE';
  }

  public updateData(): void {
    const job: JobsModel = {
      ...this.informationControl.value,
      updatedAt: new Date(),
    };
    this.service.updateData(this.selectedItemId, job, ModelType.Job).then((updatedJob: JobsModel) => {
      const jobsInd: number = this.jobsData.data.findIndex((jobsData: JobsModel) => jobsData.id === updatedJob.id);
      this.jobsData.data[jobsInd] = updatedJob;
      this.jobsData = new MatTableDataSource<JobsModel>(this.jobsData.data);
    });
    this.formReset();
  }
}
