import { Component, OnInit } from '@angular/core';
import { EPageAction } from '../../shared/enums/category-page-action.enum';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributeDto, AttributeValue } from '../../shared/dtos/attribute.dto';
import { AttributeService } from '../../shared/services/attribute.service';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  isNewAttribute: boolean;
  attribute: AttributeDto;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private attributeService: AttributeService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.isNewAttribute = this.route.snapshot.data.action === EPageAction.Add;

    if (this.isNewAttribute) {
      this.buildForm(this.getEmptyAttribute());
    } else {
      this.fetchAttribute();
    }
  }

  goBack() {
    this.router.navigate(['admin', 'attribute']);
  }

  save() {
    if (this.form.invalid) {
      this.validateAllControls();
      return;
    }

    if (this.isNewAttribute) {
      this.addNewAttribute();
    } else {
      this.updateAttribute();
    }
  }

  deleteAttribute() {
    if (!confirm(`Вы действительно хотите удалить атрибут ${this.attribute.id}?`)) {
      return;
    }

    this.attributeService.deleteAttribute(this.attribute.id).subscribe(
      _ => {
        this.goBack();
      },
      error => console.warn(error)
    );
  }

  addOption() {
    const controlOptions = this.form.get('values').value as AttributeValue[];
    controlOptions.push(this.getEmptyAttributeValue());
  }

  onRadioChange(optionIndex: number) {
    const controlOptions = this.form.get('values').value as AttributeValue[];
    controlOptions.forEach((option, index) => {
      option.isDefault = optionIndex === index;
    });
  }

  deleteOption(index: number) {
    const controlOptions = this.form.get('values').value as AttributeValue[];
    controlOptions.splice(index, 1);
  }

  private buildForm(attribute: AttributeDto) {
    this.form = this.formBuilder.group({
      id: [{ value: attribute.id, disabled: !this.isNewAttribute }, [Validators.pattern(/[a-zA-Z\-_]/g), Validators.required]],
      label: [attribute.label, Validators.required],
      values: [attribute.values],
      groupName: attribute.groupName
    });
  }

  private fetchAttribute() {
    const id = this.route.snapshot.paramMap.get('id');

    this.attributeService.fetchAttribute(id).subscribe(
      attribute => {
        this.attribute = attribute;
        this.buildForm(this.attribute);
      },
      error => console.warn(error)
    )
  }

  private validateAllControls() {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  isControlInvalid(control: AbstractControl) {
    return !control.valid && control.touched;
  }

  private addNewAttribute() {
    const dto = this.form.value;
    this.attributeService.addNewAttribute(dto).subscribe(
      attribute => {
        this.router.navigate(['admin', 'attribute', 'edit', attribute.id]);
      },
      error => console.warn(error)
    );
  }

  private updateAttribute() {
    const dto = {
      ...this.attribute,
      ...this.form.value
    };

    this.attributeService.updateAttribute(this.attribute.id, dto).subscribe(
      attribute => {
        this.attribute = attribute;
      },
      error => console.warn(error)
    )
  }

  private getEmptyAttribute(): AttributeDto {
    return {
      id: '',
      label: '',
      groupName: '',
      values: []
    };
  }

  private getEmptyAttributeValue(): AttributeValue {
    return {
      isDefault: false,
      name: ''
    };
  }
}