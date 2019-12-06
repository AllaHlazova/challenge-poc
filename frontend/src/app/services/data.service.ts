import {Injectable} from '@angular/core';
import {FeathersService} from '../shared/feathers.service';
import {Paginated} from '@feathersjs/feathers';

export interface JobsModel {
  id?: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel {
  id?: number;
  name: string;
  dateOfBirth: Date;
  email: string;
  status: string;
  hourlyRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ModelType {
  Job = 'job',
  User = 'user',
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  jobsService = this.feathers.createService<JobsModel>(ModelType.Job);
  userService = this.feathers.createService<UserModel>(ModelType.User);

  constructor(private feathers: FeathersService) {
  }

  // tslint:disable-next-line:max-line-length
  getData(type: ModelType): Promise<(JobsModel | JobsModel[] | Paginated<JobsModel>) | (UserModel | UserModel[] | Paginated<UserModel>)> {
    switch (type) {
      case ModelType.Job:
        return this.jobsService.find();
      case ModelType.User:
        return this.userService.find();
    }
  }

  addData(data, type: ModelType): Promise<JobsModel | JobsModel[] | UserModel | UserModel[]> {
    switch (type) {
      case ModelType.Job:
        return this.jobsService.create(data);
      case ModelType.User:
        return this.userService.create(data);
    }
  }

  deleteData(id, type: ModelType): Promise<JobsModel | UserModel> {
    switch (type) {
      case ModelType.Job:
        return this.jobsService.remove(id);
      case ModelType.User:
        return this.userService.remove(id);
    }
  }

  updateData(id: number, data, type: ModelType): Promise<JobsModel | UserModel> {
    switch (type) {
      case ModelType.Job:
        return this.jobsService.update(id, data);
      case ModelType.User:
        return this.userService.update(id, data);
    }
  }
}
