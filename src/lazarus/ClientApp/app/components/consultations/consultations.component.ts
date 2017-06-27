import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';


@Component({
    selector: 'consultations',
    templateUrl: './consultations.component.html',
    styleUrls: ['./consultations.component.css'],
    animations: [fadeInOut]
})
export class ConsultationsComponent {

}
