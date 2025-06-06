import { ChangeDetectorRef, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileExplorerConfig } from './file-explorer-config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'fe-file-explorer-config',
  templateUrl: './file-explorer-config.component.html',
  styleUrls: ['./file-explorer-config.component.scss']
})
export class FileExplorerConfigComponent {
  constructor(
    private fb: FormBuilder,
  ) { }
  /**表单控件类型 */
  _type: any
  @Input()
  public set type(v: any) {
    this._type = v
    this.dataLoaded()
  }
  /**表单实体 */
  _Entity: FormGroup | undefined
  @Input()
  public set Entity(v: FormGroup) {
    this._Entity = v;
    this.dataLoaded()
  }
  /**选择的表单信息 */
  _selected: any
  @Input()
  public set selected(v: any) {
    this._selected = v

    this.dataLoaded()
  }
  get formConfiguration() {
    return this._Entity.get('formConfiguration') as FormGroup
  }
  @ViewChild('submitclick', { static: true }) submitclick: ElementRef;

  private cdr = inject(ChangeDetectorRef);
  async dataLoaded() {
    if (this._Entity && this._type) {
      await this.AfterInit();
      this.cdr.detectChanges(); // 手动触发变更检测
      this.submitclick?.nativeElement?.click();
    }
  }

  AfterInit() {
    return new Promise((resolve, rejects) => {
      this._Entity.setControl('formConfiguration', this.fb.group(new FileExplorerConfig()))
      if (this._selected && this._selected.formControlName == this._type) {
        this.formConfiguration.patchValue({
          ...this._selected.formConfiguration
        })
      }
      resolve(true)
    })
  }
}
