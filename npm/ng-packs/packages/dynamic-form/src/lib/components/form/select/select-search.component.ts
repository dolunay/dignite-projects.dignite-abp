/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'df-select-search',
  templateUrl: './select-search.component.html',
  styleUrl: './select-search.component.scss',
})
export class SelectSearchComponent {
  constructor(private fb: FormBuilder) {}

  /**字段配置列表 */
  _fields: any = '';
  @Input()
  public set fields(v: any) {
    this._fields = v;
  }

  /**父级字段名称，用于为表单设置控件赋值 */
  _parentFiledName: any;
  @Input()
  public set parentFiledName(v: any) {
    this._parentFiledName = v;
  }
  /**父级字段名称，用于为表单设置控件赋值 */
  _selected: any;
  @Input()
  public set selected(v: any) {
    this._selected = v;
  }

  /**表单实体 */
  _entity: FormGroup | undefined;
  @Input()
  public set entity(v: any) {
    this._entity = v;
    this.dataLoaded();
  }
  @ViewChild('submitclick', { static: true }) submitclick: ElementRef;

  get extraProperties() {
    return this._entity?.get('extraProperties') as FormGroup;
  }
  private cdr = inject(ChangeDetectorRef);
  /**数据加载完成 */
  async dataLoaded() {
    if (this._fields && this._entity) {
      await this.AfterInit();
      this.cdr.detectChanges(); // 手动触发变更检测
      this.submitclick?.nativeElement?.click();
    }
  }

  formConfiguration: any = '';
  AfterInit() {
    return new Promise((resolve, rejects) => {
      const ValidatorsArray: any[] = [];
      this.formConfiguration = this._fields.field.formConfiguration;
      const isMultiple = this.formConfiguration['Select.Multiple'];
      const selectValue: any = isMultiple ? [] : [];
      for (const element of this.formConfiguration['Select.Options']) {
        for (const key in element) {
          const item = element[key];
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          element[capitalizedKey] = item;
        }
        // if (this._selected) {
        //   if (Array.isArray(this._selected) && element.Selected && this._selected.length === 0) {
        //     selectValue = isMultiple ? [...selectValue, element.Value] : [element.Value];
        //   }
        // }
      }
      this._selected = selectValue;
      const newControl = this.fb.control(this._selected, ValidatorsArray);
      this.extraProperties.setControl(this._fields.field.name, newControl);
      resolve(true);
    });
  }
  changeValue(event) {
    const selectvalue = this.extraProperties.get(this._fields.field.name).value;
    if (selectvalue[0] === '') {
      this.extraProperties.get(this._fields.field.name).setValue([]);
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.extraProperties.removeControl(this._fields.field.name);
  }
}
