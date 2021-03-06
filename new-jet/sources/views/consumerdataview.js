import {JetView} from 'webix-jet';
import { unions } from "models/unions";
export default class ConsumerDataView extends JetView {
    config(){

        const flag = [
            {id:0, No:"No"},
            {id:1, Yes:"Yes"},
        ]
	
		return {
			view:"datatable",
            select:true,
            localId:"list",
            scroll:"true",
            tooltip:true,
            data:unions,
            save: {
                url: 'json->/api/central/union',
                updateFromResponse: true
            },
			columns:[
				{ id:"Uname", header:["Credit Union", {content:"textFilter"}], sort:"string",adjust:"header", fillspace:3 },
				{ id:"charter_num", header:["Charter Number", {content:"textFilter"}], sort:"int",adjust:"header",fillspace:3 },
                { id:"acct_manager", header:["Account Manager", {content:"textFilter"}], sort:"string",adjust:"header", fillspace:3},
                { id:"vendor_id", header:["Vendor ID", {content:"textFilter"}], sort:"string",adjust:"header", fillspace:3 },
                { id:"aws_acct_id", header:["Aws Account ID", {content:"textFilter"}], sort:"string",adjust:"header" ,fillspace:3},
                { id:"activation_btn", header:["Active"], sort:"text",adjust:"header" , template:this.checkbox, editor:"false", options:flag },
                { id:"sftp_flag", header:["SFTP"], sort:"text",adjust:"header", template:this.checkbox, editor:"false", options:flag},
                { id:"freeze_flag", header:["Freeze Flag"], sort:"text",adjust:"header", template:this.checkbox, editor:"false", options:flag}
            ],
            on:{
                onViewChange:(prev)=>{
                    const button = this.$$("add");
                    if(prev == "gridView"){
                        button.hide();
                    } else {
                        button.show();
                    }
                },
                onAfterSelect:id => {
                    const union = unions.getItem(id);
                    this.app.callEvent("union:select",[union]);
                },
                onItemDblClick:id => {
                    if (this.getUrl()[0].page !== "customers")
                        this.show("customers?user="+id+"/information");
                    else this.show("information");
                }
            }
		};
	}
	init(){
        
        const list = this.$$("list");

        this.on(this.app,"customer:new", nada => {
            list.unselectAll();
        });


        unions.waitData.then(() => {
            if (this.getUrl()[1].page !== "customers"){
                const cur_user = this.getParam("user",true);
                gridView.select(cur_user);
                gridView.showItem(cur_user);
            }
        });
            
        this.on(this.app,"customer:save",(data) => {
            const id = data.id || this.getParam("user",true);
            unions.updateItem(id,data);
            webix.message(_("Saved"));
        });


		this.on(this.app,"customer:select",unions => {
			unions.waitData.then(() => {
				view.filter(obj => {
					return obj.id%6 === unions.id%6;
				});
			});
		});
    }
    checkbox(obj, common, value){
        return value == '1' ? 'Yes' : 'No';
    }
}



