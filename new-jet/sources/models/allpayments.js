export const allpayments = new webix.DataCollection({
	url:"/api/central/payment",
	scheme:{
		$init:function(obj){
			obj.date = webix.i18n.parseFormatDate(obj.date);
			const curr_month = new Date().getMonth();
			const data_month = obj.date.getMonth();
			if (curr_month - data_month > 0){
				if (obj.id < 25)
					obj.date.setMonth(curr_month);
				else if (obj.id >= 25)
					obj.date.setMonth(curr_month-1);
			}
		}
	}
});
