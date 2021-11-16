var fnObj = {};
var stattype = "";

var ACTIONS = axboot.actionExtend(fnObj, {
	PAGE_SEARCH: function (caller, act, data) {
		var mType = parent.axboot.modal.getData().sendData;
		var inter = parent.axboot.modal.getData().inter;
		var mCnt = 0;
		
		stattype = mType;
		
        axboot.ajax({
            type: "GET",
            url: "/api/statLstMng/getStatModal",
            cache : false,
            data: {stat_gubun:"SKILL", dispname:"skCall"},
            callback: function (res) {
            	var str="";
            	var tr_seq = 0;
                for (var i = 0; i < res.length; i++) {
                	if(mType=="major_factor"){
                		if(res[i].gubun=="M"){                			
                			str+="<tr>";
                			tr_seq++;
                			mCnt++;
                		}else{
                			str+="<tr style='display:none;'>";
                		}
                	}else{
                		if(res[i].gubun!="M"){
                			str+="<tr>";
                			tr_seq++;
                		}else{
                			str+="<tr style='display:none;'>";
                			mCnt++;
                		}
                	}					
                	str+="<td id='num'>"+tr_seq+"</td>";
                	str+="<td id='sg'>"+res[i].sgroup+"</td>";
                	str+="<td id='cn'>"+res[i].hanname+"<input id='cn_hidden' type='hidden' value='"+res[i].colname+"'><input id='num_hidden' type='hidden' value='"+res[i].seq+"'><input id='stat_seq' type='hidden' value='"+res[i].statseq+"'></td>";
                	str+="<td id='cb_yn'>";
					if(res[i].use_yn == 'Y')
					{
						if(inter == '5m' || inter == '15m' || inter == '1h')
						{
							if(res[i].interval == "0" || res[i].interval == "1" || res[i].interval == "2") 
	                 		{
								str+="<input id='use_yn' type='checkbox' checked='checked' name='" + res[i].gubun +"'>";
	                 		}
							else
							{
								str+="<input id='use_yn' type='checkbox' checked='checked' disabled=true name='" + res[i].gubun +"'>";	
							}							
						}
						else if(inter == 'day')
						{
							if(res[i].interval == "0" || res[i].interval == "2" || res[i].interval == "3") 
	                 		{
								str+="<input id='use_yn' type='checkbox' checked='checked' name='" + res[i].gubun +"'>";
	                 		}
							else
							{
								str+="<input id='use_yn' type='checkbox' checked='checked' disabled=true name='" + res[i].gubun +"'>";	
							}							
						}
						else if(inter == 'month' || inter == 'year')
						{
							if(res[i].interval == "0" || res[i].interval == "3") 
	                 		{
								str+="<input id='use_yn' type='checkbox' checked='checked' name='" + res[i].gubun +"'>";
	                 		}
							else
							{
								str+="<input id='use_yn' type='checkbox' checked='checked' disabled=true name='" + res[i].gubun +"'>";	
							}
						}					
					}
					else
					{
						if(inter == '5m' || inter == '15m' || inter == '1h')
						{
							if(res[i].interval == "0" || res[i].interval == "1" || res[i].interval == "2") 
	                 		{
								str+="<input id='use_yn' type='checkbox' name='" + res[i].gubun +"'>";
	                 		}
							else
							{
								str+="<input id='use_yn' type='checkbox' disabled=true name='" + res[i].gubun +"'>";	
							}							
						}
						else if(inter == 'day')
						{
							if(res[i].interval == "0" || res[i].interval == "2" || res[i].interval == "3") 
	                 		{
								str+="<input id='use_yn' type='checkbox' name='" + res[i].gubun +"'>";
	                 		}
							else
							{
								str+="<input id='use_yn' type='checkbox' disabled=true name='" + res[i].gubun +"'>";	
							}							
						}
						else if(inter == 'month' || inter == 'year')
						{
							if(res[i].interval == "0" || res[i].interval == "3") 
	                 		{
								str+="<input id='use_yn' type='checkbox' name='" + res[i].gubun +"'>";
	                 		}
							else
							{
								str+="<input id='use_yn' type='checkbox' disabled=true name='" + res[i].gubun +"'>";	
							}
						}					
					}
					str+="</td>";
									
				}
                $("#sortable_tbody").append(str);                
                               
                $("#sortable_tbody").sortable({
            		helper: function(e, tr){
            		   var $originals = tr.children();
            		   var $helper = tr.clone();
            		   $helper.children().each(function(index){
            		      $(this).width($originals.eq(index).width());
            		   });
            		   return $helper;
            		},
            		axis:'y',
            		cursor : 'move',
            		update: function(event, ui) {
            			$("#sortable_tbody>tr").each(function(i){
            				if(mType=="major_factor"){
            					var index = i+1;
            				}
            				else{
            					var index = i+1-mCnt;
            				}
            				
            				$("#sortable_tbody>tr").eq(i).find('#num').text(index);
            			});
            		}
            	}).disableSelection();
            	
            }
        });

        return false;
    },
    PAGE_CLOSE: function (caller, act, data) {
        parent.axboot.modal.close();
    },
    PAGE_SAVE: function (caller, act, data) {
    	axboot
            .call({
            	type: "POST",
                url: "/api/statLstMng/StatModalSave",
                data: JSON.stringify(this.tableView.getData()),
                callback: function (res) {
                	if(res==1){
                		axDialog.alert({
                            theme: "primary",
                            title: "항목 저장",
                            msg: "저장되었습니다.",
                            onStateChanged: function () {
                                if (this.state === "close") {
                                	parent.axboot.modal.callback(1);
                                }
                            }
                        });
                	}else{
                		axDialog.alert({
                            theme: "primary",
                            title: "항목 저장",
                            msg: "실패하였습니다.",
                            onStateChanged: function () {
                                if (this.state === "close") {
                                	parent.axboot.modal.callback(1);
                                }
                            }
                        });
                	}
                }
            })
            .done(function () {
            	
            });
    }
});

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    this.pageButtonView.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        axboot.buttonClick(this, "data-page-btn", {
            "save": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
            },
            "close": function () {
                ACTIONS.dispatch(ACTIONS.PAGE_CLOSE);
            }
        });
    }
});

function checkAll() {
	if($("#checkAll").is(":checked"))
	{
		if(stattype == "major_factor")
		{
			$("input[name=M").prop("checked", true);
		}
		else
		{
			$("input[name=N").prop("checked", true);
			$("input[name=T").prop("checked", true);
			$("input[name=P").prop("checked", true);
			$("input[name=PS").prop("checked", true);
			//$("input[name=PSG").prop("checked", true);
			$("input[name=TX").prop("checked", true);
		}
	}
	else
	{
		if(stattype == "major_factor")
		{
			$("input[name=M").prop("checked", false);
		}
		else
		{
			$("input[name=N").prop("checked", false);
			$("input[name=T").prop("checked", false);
			$("input[name=P").prop("checked", false);
			$("input[name=PS").prop("checked", false);
			//$("input[name=PSG").prop("checked", false);
			$("input[name=TX").prop("checked", false);
		}
	}
}

//== view 시작
/**
 * tableView
 */
fnObj.tableView = {
    initView: function () {    	
    },
    getData: function () {
    	var arr =[];
    	var cnt = 0;
		
    	$("#sortable_table tr").each(function(){
		  	if(cnt==0){
			  	cnt++;
		  	}
		  	else{
			  	var num = $(this).children("#cn").children("#num_hidden").val();
			  	var stat_seq = $(this).children("#cn").children("#stat_seq").val();
			  	var cn = $(this).children("#cn").children("#cn_hidden").val();
			  	var yn = $(this).children().children("#use_yn").is(":checked");
			  	if(yn == true){
			  		yn = "Y";
			  	}
			  	else{
			  		yn = "N";
			  	}
			  	arr.push({num: num, yn: yn, stat_seq:stat_seq});
			  	cnt++;
		  	}
	  	});
	  	this.sdata=arr;
	  	var data = [];
	  	data.push({
        	"user_factor": this.sdata,
        	"stat_gubun":"SKILL",
        	"dispname":"skCall"
    	});
        return $.extend({}, data);  
    }
}