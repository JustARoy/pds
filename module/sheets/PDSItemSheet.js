export default class PDSItemSheet extends ItemSheet {
    get template(){
        return 'system/pds/templates/sheets/${this.item.data.type}-sheet.hbs';
    }
}