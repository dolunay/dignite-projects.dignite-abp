/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'df-switch-search',
  templateUrl: './switch-search.component.html',
  styleUrl: './switch-search.component.scss'
})
export class SwitchSearchComponent {
 constructor(private fb: FormBuilder) {}

  /**表单实体 */
  _entity: FormGroup | any;
  @Input()
  public set entity(v: any) {
    this._entity = v;
    this.dataLoaded();
  }

  /**字段配置列表 */
  _fields: any = '';
  @Input()
  public set fields(v: any) {
    this._fields = v;
    this.dataLoaded();
  }

  /**父级字段名称，用于为表单设置控件赋值 */
  _parentFiledName: any;
  @Input()
  public set parentFiledName(v: any) {
    this._parentFiledName = v;
    this.dataLoaded();
  }
  /** */
  _selected: any;
  @Input()
  public set selected(v: any) {
    // ?v:false;
    this._selected = v;
    this.dataLoaded();
  }
  @ViewChild('submitclick', { static: true }) submitclick: ElementRef;

  get extraProperties() {
    return this._entity.get('extraProperties') as FormGroup;
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

  AfterInit() {
    return new Promise((resolve, rejects) => {
      const ValidatorsArray:any = [];
      const newControl = this.fb.control(
        this._selected
          ? this._selected
          : this._selected === false
          ? this._selected
          : '',
        ValidatorsArray
      );
      this.extraProperties.setControl(this._fields.field.name, newControl);
      resolve(true);
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.extraProperties.removeControl(this._fields.field.name);
  }
}
