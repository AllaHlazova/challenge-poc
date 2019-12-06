import {Component, OnInit} from '@angular/core';
import {FeathersService} from '../shared/feathers.service';
import {DataService, ModelType, UserModel} from '../services/data.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Paginated} from '@feathersjs/feathers';
import {Button} from '../jobs/jobs.component';
import {MatTableDataSource} from '@angular/material/table';

interface Status {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-component',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  private service: DataService = new DataService(this.feathers);
  public userData: MatTableDataSource<UserModel> = new MatTableDataSource<UserModel>([]);
  public displayedColumns: string[] = ['id', 'name', 'dateOfBirth', 'email', 'status', 'hourlyRate', 'createdAt', 'updatedAt', 'options'];
  public buttonStatus: Button = 'ADD';
  public selectedItemId: number;
  public startDate: Date = new Date(1990, 0, 1);
  public statuses: Status[] = [
    {
      icon: 'male',
      label: 'Male',
      value: 'male'
    },
    {
      icon: 'female',
      label: 'Female',
      value: 'female',
    },
    {
      icon: 'other',
      label: 'Other',
      value: 'other'
    }];


  informationControl: FormGroup = new FormGroup(
    {
      name: new FormControl(''),
      dateOfBirth: new FormControl(''),
      email: new FormControl('', Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)),
      status: new FormControl(''),
      hourlyRate: new FormControl('', Validators.min(0)),
    }
  );

  constructor(private feathers: FeathersService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    // Register svg icons for Angular Material
    iconRegistry.addSvgIcon(
      'male',
      sanitizer.bypassSecurityTrustResourceUrl('assets/male.svg'));
    iconRegistry.addSvgIcon(
      'female',
      sanitizer.bypassSecurityTrustResourceUrl('assets/female.svg'));
    iconRegistry.addSvgIcon(
      'other',
      sanitizer.bypassSecurityTrustResourceUrl('assets/other.svg'));
  }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.service.getData(ModelType.User).then((value: Paginated<UserModel>) => {
      this.userData = new MatTableDataSource<UserModel>(value.data);
    });
  }

  public addUser(): void {
    const user: UserModel = {
      ...this.informationControl.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.service.addData(user, ModelType.User).then((newUser: UserModel) => {
      this.userData.data.push(newUser);
      this.userData = new MatTableDataSource<UserModel>(this.userData.data);
    });
    this.formReset();
  }

  public setData(element): void {
    const updateFields: string[] = [
      'name',
      'dateOfBirth',
      'email',
      'status',
      'hourlyRate'
    ];
    updateFields.forEach((field: string) => {
      this.informationControl.controls[field].setValue(element[field]);
    });
    this.selectedItemId = element.id;
    this.buttonStatus = 'UPDATE';
  }

  public updateData(): void {
    const user: UserModel = {
      ...this.informationControl.value,
      updatedAt: new Date(),
    };
    this.service.updateData(this.selectedItemId, user, ModelType.User).then((updatedUser: UserModel) => {
      const userInd: number = this.userData.data.findIndex((userData: UserModel) => userData.id === updatedUser.id);
      this.userData.data[userInd] = updatedUser;
      this.userData = new MatTableDataSource<UserModel>(this.userData.data);
    });
    this.formReset();
  }

  public deleteUser(id: number): void {
    this.service.deleteData(id, ModelType.User).then((deletedUser: UserModel) => {
      const userInd: number = this.userData.data.findIndex((userData: UserModel) => userData.id === deletedUser.id);
      this.userData.data.splice(userInd, 1);
      this.userData = new MatTableDataSource<UserModel>(this.userData.data);
    });
  }

  public formReset(): void {
    this.selectedItemId = null;
    this.informationControl.reset();
    this.buttonStatus = 'ADD';
  }

  public getStatusFieldByValue(value: string, field: string): string {
    const status = this.statuses.find((val) => val.value === value);
    if (status) {
      return status[field];
    }
    return '';
  }
}
