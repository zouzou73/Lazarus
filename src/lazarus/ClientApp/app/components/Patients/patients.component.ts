import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';

@Component({
    selector: 'patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.css'],
    animations: [fadeInOut]
})
export class PatientsComponent {
}
