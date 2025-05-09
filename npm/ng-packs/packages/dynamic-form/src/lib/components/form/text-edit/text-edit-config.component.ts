/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TextEditConfig } from './text-edit-config';
import { TextEditMode } from '../../../enums/text-edit-mode';

@Component({
  selector: 'df-text-edit-config',
  templateUrl: './text-edit-config.component.html',
  styleUrls: ['./text-edit-config.component.scss'],
})
export class TextEditConfigComponent {
  constructor(private fb: FormBuilder) {}
  _TextEditMode = TextEditMode;
  /**表单控件类型 */
  _type: any;
  @Input()
  public set type(v: any) {
    this._type = v;
    this.dataLoaded();
  }
  /**表单实体 */
  _Entity: FormGroup | undefined;
  @Input()
  public set Entity(v: FormGroup) {
    this._Entity = v;
    this.dataLoaded();
  }
  /**选择的表单信息 */
  _selected: any;
  @Input()
  public set selected(v: any) {
    this._selected = v;
    this.dataLoaded();
  }
  get formConfiguration() {
    return this._Entity.get('formConfiguration') as FormGroup;
  }
  @ViewChild('submitclick', { static: true }) submitclick: ElementRef;
  private cdr = inject(ChangeDetectorRef);
  async dataLoaded() {
    if (this._Entity && this._type) {
      await this.AfterInit();
      this.cdr.detectChanges(); // 手动触发变更检测
      // this.submitclick?.nativeElement?.click();
    }
  }
  RadioIndex1: any=Math.floor(Math.random() * 1001);
  RadioIndex2: any=Math.floor(Math.random() * 1001);

  AfterInit() {
    return new Promise((resolve, rejects) => {
      this._Entity.setControl('formConfiguration', this.fb.group(new TextEditConfig()));
      if (this._selected && this._selected.formControlName == this._type) {
        this.formConfiguration.patchValue({
          ...this._selected.formConfiguration,
        });
      }
      resolve(true);
    });
  }
}
