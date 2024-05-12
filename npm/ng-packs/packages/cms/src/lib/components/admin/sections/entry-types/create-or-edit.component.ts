import { ToasterService } from '@abp/ng.theme.shared';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { CreateOrEditEntryTypeInputBase, fieldTabsBase, fieldsBase } from './create-or-edit.-entry-type-input-base';
import { FieldGroupAdminService, FieldAdminService } from '../../../../proxy/admin/fields';
import { EntryTypeAdminService } from '../../../../proxy/admin/sections';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizationService } from '@abp/ng.core';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.theme.shared/extensions';
import { ECmsComponent } from '../../../../enums';
import { CmsApiService } from '../../../../services/cms-api.service';
import { UpdateListService } from '../../../../services/update-list.service';

@Component({
  selector: 'cms-create-or-edit',
  templateUrl: './create-or-edit.component.html',
  styleUrls: ['./create-or-edit.component.scss'],
  providers: [
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: ECmsComponent.SectionsCreateOrEdit,
    },
  ]
})
export class CreateOrEditComponent  implements OnInit{

  constructor(
    // private fb: FormBuilder,
    private toaster: ToasterService,
    public _location: Location,
    private route: ActivatedRoute,
    public _FieldGroupAdminService: FieldGroupAdminService,
    public _FieldAdminService: FieldAdminService,
    public _EntryTypeAdminService: EntryTypeAdminService,
    public _LocalizationService: LocalizationService,
    public _CmsApiService: CmsApiService,
    private router: Router,
  ) { }
  private fb=inject(FormBuilder)
  private _UpdateListService=inject(UpdateListService)
  /**表单实体 */
  newEntity: FormGroup | undefined = this.fb.group(new CreateOrEditEntryTypeInputBase())
  /**版块id */
  sectionId: string = ''
  /**条目类型id */
  entryTypesId: string = ''
  /**条目类型详情 */
  entryTypesSelect: any

  get fieldTabs() {
    return this.newEntity.get('fieldTabs') as FormArray;
  }

  /**获取提交按钮替身，用于真实触发表单提交 */
  @ViewChild('submitclick', { static: true }) submitclick: ElementRef;

  /**触发提交按钮 */
  submitclickBtn(){
    this.submitclick.nativeElement.click()
  }
  ngOnInit() {
    let sectionId = this.route.snapshot.params.sectionsId
    this.entryTypesId = this.route.snapshot.params.entryTypesId || ''
    if (sectionId) {
      this.sectionId = sectionId
      this.addControlToFieldTabs()
      this.getFieldGroup()
    }
  }

  /**给fieldTabs添加新控件 */
  addControlToFieldTabs(nameValue = '') {
    const newFormGroup = this.fb.group(new fieldTabsBase({
      name: this.fieldTabs.length === 0 ? this._LocalizationService.instant(`Cms::FieldTab`) : nameValue,
    }));
    this.fieldTabs.push(newFormGroup)
    this.resultSource.push(newFormGroup.value)
    this.navActive = this.resultSource.length - 1
  }


  /**获取字段分组 */
  getFieldGroup() {
    this._FieldGroupAdminService.getList({}).subscribe(async (res) => {
      let fieldList: any = await this.getFieldList()
      let fieldGroupList = res.items
      fieldGroupList.unshift({
        id: null,
        name: 'UngroupedFields'
      })
      fieldGroupList.forEach((el: any, index) => {
        el.fields = fieldList.filter(els => els.groupId === el.id)
      });
      this.fieldGroupList = fieldGroupList
      this.fieldList = this.deepClone(fieldList)
      let entryTypesId = this.entryTypesId
      if (entryTypesId) {
        this.entryTypesId = entryTypesId
        this.getEntryTypes()
      }
    })
  }
  /**获取条目类型详情 */
  getEntryTypes() {
    let fieldList: any = this.deepClone(this.fieldList)
    this._EntryTypeAdminService.get(this.entryTypesId).subscribe(res => {
      res.fieldTabs.forEach(el => {
        el.fields.forEach((eld: any) => {
          eld.id = eld.fieldId
          eld.groupId = fieldList.find(elfd=>elfd.id==eld.fieldId).groupId
          this.formRightGroup.push(eld)
          let fieldindex = fieldList.findIndex(elfl => elfl.id == eld.fieldId)
          fieldList.splice(fieldindex, 1)
        })
      })
      this.fieldGroupList.forEach((el: any, index) => {
        el.fields = fieldList.filter(els => els.groupId === el.id)
      });
      this.newEntity.patchValue(res)
      this.entryTypesSelect = res
      this.resultSource = res.fieldTabs
    })
  }
  /**
   * 深拷贝--方法
   * $api.deepClone()  */
  deepClone(obj: any) {
    if (typeof obj !== 'object' || obj === null) return obj;
    const result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key] instanceof Date) {
            result[key] = new Date(obj[key].getTime());
          } else if (obj[key] instanceof RegExp) {
            result[key] = new RegExp(obj[key]);
          } else {
            result[key] = this.deepClone(obj[key]);
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }
  /**
   * 
   * @param nameValue 获取所有字段
   */
  getFieldList() {
    return new Promise((resolve, rejects) => {
      this._FieldAdminService.getList({
        maxResultCount: 1000
      }).subscribe((res: any) => {
        res.items.forEach(el => {
          el.required = false
          el.showOnList = false
        })
        resolve(res.items)
      })
    })
  }


  /**
   * 拖拽 功能*/
  /**数据源 */
  /**数据源-字段分组数据-包含字段数据 fields */
  fieldGroupList: any[] = []
  /**数据源-所有字段列表 */
  fieldList: any[] = []
  /**数据源拖拽的分组下标 */
  DataSourceGroupIndex: number
  /**数据源拖拽的字段下标 */
  DataSourceFieldIndex: number
  /**目标源 结果*/
  resultSource: any[] = []

  /**从数据源拖拽的元素 */
  fromDataSourceDragEl: any
  /**从目标源拖拽的元素 */
  fromResultSourceDragEl: any

  /**来自数据源的集合，用于从目标源拖回数据源时的判断，与取值 */
  formRightGroup: any[] = []
  /**从数据源开始拖拽 */
  fromDataSourceDragStart(element, fieldIndex, groupIndex) {
    this.fromDataSourceDragEl = element
    this.DataSourceFieldIndex = fieldIndex
    this.DataSourceGroupIndex = groupIndex
    this.fromResultSourceDragEl = undefined

  }
  /**从目标源开始拖拽 */
  fromResultSourceDragStart(element) {
    this.fromResultSourceDragEl = element
    this.fromDataSourceDragEl = undefined
    this.DataSourceFieldIndex = undefined
    this.DataSourceGroupIndex = undefined
  }
  /**拖拽到数据源时触发 */
  dragToDataSourceDropped() {
    //从数据源拖拽到数据源-排序
    if (this.fromDataSourceDragEl) {
    }
    let _fromResultSourceDragEl = this.fromResultSourceDragEl
    let formRightGroup = this.deepClone(this.formRightGroup)
    let fieldList = this.deepClone(this.fieldList)

    if (_fromResultSourceDragEl) {//移动
      //从目标源拖拽到数据源
      // 拖拽目标源的下标
      let dragResultSourceIndex = this.resultSource[this.navActive].fields.findIndex(el => el.id == _fromResultSourceDragEl.id)
      //删除目标源中的数据
      this.resultSource[this.navActive].fields.splice(dragResultSourceIndex, 1)
      formRightGroup.splice(formRightGroup.findIndex(el => el.id == _fromResultSourceDragEl.id), 1)
      this.fieldGroupList.forEach(el => {
        if (el.id == _fromResultSourceDragEl.groupId) {
          const elFieldsAll = fieldList.filter(els => els.groupId === el.id)
          el.fields = elFieldsAll.filter(item => !formRightGroup.some(itemB => item.id === itemB.id));
        }
      })
      this.formRightGroup = formRightGroup
    }

    this.setfieldTabsFrom()
  }
  /**拖拽到目标源时触发
   * 
   */
  dragToResultSourceDropped(fieldTabstem: any, fieldTabsIndex) {
    const _fromDataSourceDragEl = this.fromDataSourceDragEl
    //从数据源拖拽到目标源
    if (_fromDataSourceDragEl) {
      this.fieldGroupList[this.DataSourceGroupIndex].fields.splice(this.DataSourceFieldIndex, 1)
      this.resultSource[fieldTabsIndex].fields.push(_fromDataSourceDragEl)
      this.formRightGroup.push(_fromDataSourceDragEl)
    }

    this.setfieldTabsFrom()
  }
  /** 从目标源拖拽到目标源*/
  dragToResultSourceItemDropped(fieldsIndex) {
    const _fromResultSourceDragEl = this.fromResultSourceDragEl
    if (_fromResultSourceDragEl) {
      // 拖拽目标源的下标
      let dragResultSourceIndex = this.resultSource[this.navActive].fields.findIndex(el => el.id == _fromResultSourceDragEl.id)
      //删除目标源中的数据
      this.resultSource[this.navActive].fields.splice(dragResultSourceIndex, 1)
      this.resultSource[this.navActive].fields.splice(fieldsIndex, 0, _fromResultSourceDragEl)
    }
    this.setfieldTabsFrom()
  }
  /**设置formA表单 */
  setfieldTabsFrom() {
    let setArray = []
    this.resultSource.forEach(el => {
      let fieldsArray = []
      el.fields.forEach(item => {
        fieldsArray.push({
          "fieldId": item.id || item.fieldId,
          "displayName": item.displayName,
          "required": item?.required,
          "showOnList": item?.showOnList
        })
      })
      setArray.push({
        name: el.name,
        fields: fieldsArray
      })
    })
    this.newEntity.patchValue({
      fieldTabs: setArray
    })
  }

  
  /**保存表单 */
  save() {
    let input = this.newEntity.value
    if (this.entryTypesSelect) {
      this._EntryTypeAdminService.update(this.entryTypesSelect.id, input).subscribe(res => {
        this.toaster.success(this._LocalizationService.instant(`CmsKit::SavedSuccessfully`));
        // this._location.back()
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/cms/admin/sections`]);
          this._UpdateListService.updateList();
        });
      })
      return
    }
    input.sectionId = this.sectionId
    this._EntryTypeAdminService.create(input).subscribe(res => {
      this.toaster.success(this._LocalizationService.instant(`CmsKit::SavedSuccessfully`));
      // this._location.back()
      this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/cms/admin/sections`]);
        this._UpdateListService.updateList();
      });
    })



  }
  /**编辑Tabs表单 */
  editFieldTabsFrom: FormGroup | undefined;
  /**模态框状态 */
  visibleTabsOpen: boolean = false
  /**是否是忙碌状态 */
  modalBusy: boolean = false
  /**正在编辑的tabs */
  editFieldTabsSelect: any
  /**正在选中的nav */
  navActive: any = 0

  /**表单控件模板-动态赋值表单控件 */
  @ViewChild('editFieldTabsModalSubmitBtn', { static: false }) editFieldTabsModalSubmitBtn: ElementRef;

  /**模态框状态改变回调 */
  VisibleTabsChange(event) {
    if (!event) {
      this.editFieldTabsSelect = ''
      return
    }
  }
  /**新建增加FieldTabs */
  addFieldTabs() {
    this.editFieldTabsFrom = this.fb.group(new fieldTabsBase());
    this.visibleTabsOpen = true

  }
  /**正在编辑的tab下标 */
  newEditFieldTabsIndex: number
  /**编辑FieldTabs */
  editFieldTabs(item, i) {
    this.editFieldTabsFrom = this.fb.group(new fieldTabsBase({
      name: item.name
    }));
    this.editFieldTabsSelect = item
    this.visibleTabsOpen = true
    this.newEditFieldTabsIndex = i
  }

  /**保存编辑tabs表单 */
  editFieldTabsSave() {
    //编辑
    if (this.editFieldTabsSelect) {
      this.resultSource[this.newEditFieldTabsIndex].name = this.editFieldTabsFrom.value.name
      this.navActive = this.newEditFieldTabsIndex
    } else {
      //新建
      this.addControlToFieldTabs(this.editFieldTabsFrom.value.name)
    }
    this.visibleTabsOpen = false
    this.setfieldTabsFrom()
  }
  /**删除某个tabs表单 */
  deleteFieldTabs(index) {
    this.fieldTabs.removeAt(index)
    this.resultSource.splice(index,1)
  }


  /**编辑字段模态框状态 */
  visibleEditFieldOpen: boolean = false
  /**编辑字段模态框表单 */
  editFieldFrom: FormGroup | undefined;
  /**表单控件模板-动态赋值表单控件-编辑字段 */
  @ViewChild('editFieldModalSubmitBtn', { static: false }) editFieldModalSubmitBtn: ElementRef;
  /**正在编辑的字段下标 */
  EditFieldIndex: number;
  /**编辑字段模态框状态状态改变回调 */
  VisibleEditFieldChange(event) {
    if (!event) {
      this.EditFieldIndex = undefined
      return
    }
  }
  /**打开编辑字段模态框 */
  EditFieldModalOpen(items, elIndex) {
    this.visibleEditFieldOpen = true
    this.EditFieldIndex = elIndex
    this.editFieldFrom = this.fb.group(new fieldsBase(this.fieldTabs.value[this.navActive].fields[elIndex]))
  }
  /**保存编辑字段 */
  editFieldSave() {
    let input = this.editFieldFrom.value
    this.resultSource[this.navActive].fields[this.EditFieldIndex].displayName = input.displayName
    this.resultSource[this.navActive].fields[this.EditFieldIndex].required = input.required
    this.resultSource[this.navActive].fields[this.EditFieldIndex].showOnList = input.showOnList
    this.visibleEditFieldOpen = false
    this.setfieldTabsFrom()
  }



    /**name表单控件 */
    get nameInput() {
      return this.newEntity.get('name')
    }
  /**字段标签input失去标点生成字段名字 */
  disPlayNameInputBlur(event) {
    let value = event.target.value
    let pinyin = this._CmsApiService.chineseToPinyin(value)
    let nameInput = this.nameInput
    if (nameInput.value) return
    nameInput.patchValue(pinyin)
  }

}
