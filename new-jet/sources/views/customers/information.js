import {JetView} from "webix-jet";
import "webix/tinymce/tinymce";

export default class InformationView extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		const screen = this.app.config.size;
		
		const main_info = {
			margin:10,
			rows:[
				{
					view:"text", name:"Uname",
					label:_("Credit Union Name"), labelPosition:"top",
					placeholder:_("Cridit Union Name"),
					invalidMessage:_("Credit Union's name is required")
				},
				{
					view:"text", name:"charter_num",
					label:_("Charter Number"), labelPosition:"top",
					placeholder:_("Charter Number"),
					invalidMessage:_("Charter Number is required")
				},
				{
					view:"text", name:"vendor_id",
					label:_("Vendor ID"), labelPosition:"top",
					placeholder:_("Vender ID"),
					invalidMessage:_("Vendor ID is required")
				},
				{
					view:"text", name:"acct_manager",
					label:_("Account Manager"), labelPosition:"top",
					placeholder:"Assigned Account Manager",
					invalidMessage:_("Assigned Account Manager is required")
				},
				{
					view:"text", name:"acct_manager_email",
					label:_("Account Manager Email"), labelPosition:"top",
					placeholder:"Jsanchez@trellance.com",
					invalidMessage:_("Account Manager Email is required")
				}
			]
		};



		const sftp_flag = {
			view:"radio", name:"sftp_flag",
			label:_("SFTP"), labelPosition:"top",
			value:1,
			options:[
				{ id:1, value:_("Yes") },
				{ id:0, value:_("No") }
			],
			invalidMessage:_("Selection is required")
		}

		const activation_btn = {
			view:"radio", name:"activation_btn",
			label:_("Account Active"), labelPosition:"top",
			value:1,
			options:[
				{ id:1, value:_("Yes") },
				{ id:0, value:_("No") }
			],
			invalidMessage:_("Selection is required")
		}

		const freeze_flag = {
			view:"radio", name:"freeze_flag",
			label:_("Freeze Account"), labelPosition:"top",
			value:1,
			options:[
				{ id:1, value:_("Yes") },
				{ id:0, value:_("No") }
			],
			invalidMessage:_("Selection is required")
		};

		const invoice_audit = {
			view:"checkbox", name:"invoice_audit",
			label:_("Invoice Audit"), labelPosition:"top"
		}

		const left_main = {
			gravity:3,
			minWidth:200,
			margin:5,
			rows:[
				main_info,
			]
		};

		const radio_section = {
			gravity:3,
			minWidth:200,
			margin:5,
			rows:[
				{
					view:"text", name:"num_cuu_provisioned",
					label:_("Number of Credit Union Users Provisioned"), labelPosition:"top",
					placeholder:"Number of Credit Union Users Provisioned",
					invalidMessage:_("Number of Users is required")
				},
				sftp_flag,
				activation_btn,
				freeze_flag,
				invoice_audit
			]
		}



		const more_info = {
			gravity:3,
			minWidth:200,
			margin:10,
			rows:[
				{
					view:"text", name:"aws_url", label:_("Aws Url"),
					labelPosition:"top", placeholder:_("Aws Url"),
					invalidMessage:_("AWS URL is required")
				},
				{
					view:"text", name:"aws_acct_id", label:_("Aws Account ID"),
					labelPosition:"top", placeholder:_("Aws Account ID"),
					invalidMessage:_("AWS Account ID is required")
				},
				{
					view:"text", name:"admin",
					label:_("Admin"), labelPosition:"top",
					placeholder:"User Admin",
					invalidMessage:_("User Admin is required")
				},
				{
					view:"text", name:"admin_email",
					label:_("Admin Email"), labelPosition:"top",
					placeholder:"judetheawesome@obscure.com",
					invalidMessage:_("Admin Email is required")
				},
				{
					view:"text", name:"admin_phone",
					label:_("Admin Phone"), labelPosition:"top",
					placeholder:"888-888-8888",
					invalidMessage:_("Admin Phone is required")
				}		
			]
		};

		const upper_section = {
			cols:[
				left_main,
				{ gravity:1, minWidth:20 },
				more_info,
				{ gravity:1, minWidth:20 },
				radio_section,
				
			]
		};

		const upper_section_narrow = {
			cols:[
				{
					gravity:3,
					margin:10,
					rows:[
						main_info, more_info, radio_section
					]
				},
			]
		};

		const notes = {
			view:"forminput",
			labelWidth:0,
			body:{
				rows:[
					{ view:"label", template:_("Notes"), css:"input_label" },
					{
						view:"tinymce-editor",
						borderless:true,
						name:"notes",
						localId:"notes",
						config:{
							menubar:false,
							plugins:"link",
							toolbar:"fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | link",
							content_style:"* { color:#475466; font-family:Roboto,sans-serif; font-size:15px; }"
						}
					}
				]
			}
		};

		const buttons = {
			margin:10,
			cols:[
				{},



				{
					view:"button", value:_("Reset"), autowidth:true,
					click:() => {
						webix.confirm({
							text:"You are about to reset this data <br/> Are You Sure?",
							ok:"Yes", cancel:"Cancel",
							callback:(res)=>{
								if(res){
									this.$$("notes").setValue("");  // !
									this.getRoot().clear();
								}
							}

						})

					}
				},
				{
					view:"button", value:_("Save"), type:"form", autowidth:true,
					click:() => {
						if (this.getRoot().validate()){
							const newdata = this.getRoot().getValues();
							this.app.callEvent("customer:save",[newdata]);
							this.return();
						}
					}
				},
				{
					view:"button", value:_("Delete"), type:"form", autowidth:true,
					click:() => {
						webix.confirm({
							text:"You are about to delete a union! <br/> Are you sure?",
							ok:"Yes", cancel:"Cancel",
							callback:(res)=>{
								if(res){
									const data = this.getRoot().getValues();
									this.app.callEvent("customer:delete",[data]);
									this.return();
								}
							}
						})
					}
				}
			]
		};

		return {
			view:"form",
			scroll:true,
			rows:[
				(screen !== "small") ? upper_section : upper_section_narrow,
				notes,
				buttons
			],
			rules:{
				"Uname":webix.rules.isNotEmpty,
				"charter_num":webix.rules.isNotEmpty,
				"vendor_id":webix.rules.isNotEmpty,
				"acct_manager":webix.rules.isNotEmpty,
				"acct_manager_email":webix.rules.isNotEmpty,
				"aws_url":webix.rules.isNotEmpty,
				"aws_acct_id":webix.rules.isNotEmpty,
				"admin":webix.rules.isNotEmpty,
				"admin_email":webix.rules.isNotEmpty,
				"admin_phone":webix.rules.isNotEmpty,
				"num_cuu_provisioned":webix.rules.isNotEmpty,
				"sftp_flag":webix.rules.isNotEmpty,
				"activation_btn":webix.rules.isNotEmpty,
				"freeze_flag":webix.rules.isNotEmpty
			}
		};
	}
	init(form){
		

		this.app.callEvent("form:update",[this.getParam("user",true)]);

		this.on(this.app,"customer:updatedata",union => form.setValues(union));

		this.on(this.app,"union:select",union => form.setValues(union));

		this.on(this.app,"customer:delete", union => form.setValues(union));

		this.getLocalizedComboOptions();
	}
	getLocalizedComboOptions(){
		const _ = this.app.getService("locale")._;

	}
	return(){
		this.show("/top/consumerview")
	}
}
