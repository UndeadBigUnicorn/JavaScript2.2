window.onload = function() {

    const itemsContainer = document.getElementById('items-container');
    const notBoughtItemsContainer = document.getElementById('not-bought-items-container');
    const boughtItemsContainer = document.getElementById('bought-items-container');
    let productList = [];
    let notBoughtItems = [];
    let boughtItems = [];

    $("#add-button").on( "click", function() {
        let productName = document.getElementById('input').value;
        $.post({
			url: "/addProduct",
			contentType: "application/json",
			data: JSON.stringify({name:productName}),
			success: function (response) {
                let _id = response._id;
                let _amount = response.amount;
                let _name = response.name;
                productList.push({_id: _id, name: _name, amount: _amount});
                RenderProductList();
        
                notBoughtItems.push({_id:_id,name: _name, amount: _amount});
                RenderNotBoughtItems();
        
                document.getElementById('input').value='';
			   }
		});    
    });

    $(document).on('click' , '.increment', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.second-column').find('.amount')[0];
        let amount = Number(_amount.innerHTML);
        $(this).closest('.second-column').find('.amount')[0].innerHTML=++amount;
        notBoughtItems[GetElementPos(notBoughtItems, _id)].amount = amount;
        RenderNotBoughtItems();
        UpdateAmount(_id, amount);
    });

    $(document).on('click' , '.decrement', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.second-column').find('.amount')[0];
        let amount = Number(_amount.innerHTML);
        if(amount==1)
            return;
        $(this).closest('.second-column').find('.amount')[0].innerHTML=--amount;
        notBoughtItems[GetElementPos(notBoughtItems, _id)].amount = amount;
        RenderNotBoughtItems();
        UpdateAmount(_id, amount);
    });

      $(document).on('click' , '.button-buy', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.item').find('.amount')[0].innerHTML;
        let _name = $(this).data('product-name');
        $(this).closest('.item')[0].innerHTML=`
        <div class="first-column titles">
            <span class="title crossed">${_name}</span>
        </div>
        <div class="second-column add-buttons">                   
            <span class="amount">${_amount}</span>
        </div>
        <div class="third-column option-buttons">
            <button class="button-not-bought" data-product-name="${_name}" data-product-id="${_id}" data-product-amount="${_amount}">Не куплено<span class="tooltip" data-tooltip="Відмітити як не куплене">Відмітити як не куплене</span></button>
        </div>`;
        
        notBoughtItems = notBoughtItems.filter(item => item._id!=_id);
        RenderNotBoughtItems();
        boughtItems.push({_id:_id, amount:_amount, name:_name});
        RenderBoughtItems();
        UpdateStatus(_id, true);
    });
    
    $(document).on('click' , '.button-not-bought', function(){
        let _id = $(this).data('product-id');
        let _amount= $(this).closest('.item').find('.amount')[0].innerHTML;
        let _name = $(this).data('product-name');
        $(this).closest('.item')[0].innerHTML= `
        <div class="first-column titles">
            <span class="title" data-product-id="${_id}">${_name}</span>
            <input class="input-text hiden" placeholder="Нова назва">
        </div>
        <div class="second-column add-buttons">
            <button class="decrement circular-button red-button" data-tooltip="Відняти одну одиницю" data-product-id="${_id}"><b>-</b><span class="tooltip" data-tooltip="Відняти одну одиницю">Відняти одну одиницю</span></button>
            <span class="amount">${_amount}</span>
            <button class="increment circular-button green-button" data-tooltip="Додати одну одиницю" data-product-id="${_id}"><b>+</b><span class="tooltip" data-tooltip="Додати одну одиницю">Додати одну одиницю</span></button>
        </div>
        <div class="third-column option-buttons">
        <button class="button-buy" data-product-name="${_name}" data-tooltip="Відмітити як куплене" data-product-name="${_name}" data-product-id="${_id}" data-product-amount="${_amount}">Куплено<span class="tooltip" data-tooltip="Відмітити як куплене">Відмітити як куплене</span></button>
        <button class="delete-button" data-product-name="${_name}" data-product-id="${_id}" data-tooltip="Видалити">X<span class="tooltip" data-tooltip="Видалити">Видалити</span></button>
        </div>`;
        
        boughtItems = boughtItems.filter(item => item._id!=_id);
        RenderBoughtItems();
        notBoughtItems.push({_id:_id, amount:_amount, name:_name});
        RenderNotBoughtItems();
        UpdateStatus(_id, false);
    });

    $(document).on('click' , '.delete-button', function(){
        let _id = $(this).data('product-id');     
        $.ajax({
            url: "/deleteProduct",
            method: "DELETE",
			contentType: "application/json",
			data: JSON.stringify({id:_id}),
			success: function (response) {
                notBoughtItems = notBoughtItems.filter(item => item._id!=_id);
                RenderNotBoughtItems();
                productList = productList.filter(item => item._id!=_id);
                RenderProductList();
			}
		}); 
    });

    $(document).on('click' , '.title', function(){
        let element = $(this)[0];
	if(element.className.endsWith('crossed'))
            return;
        let _id = $(this).data('product-id');
        let name = element.innerHTML;     
        let input= $(this).closest('.item').find('.input-text')[0];
        element.style.display = "none";
        input.style.display = "inline-block";
        input.value = name;
        window.onclick = (event)=>{
            if (event.target != element && event.target!= input) {
                let newName = input.value;
                input.style.display = "none";
                element.style.display = "inline";
                element.innerHTML = newName;
                UpdateName(_id, newName);            
        }
    }
    });

    function RenderNotBoughtItems(){
          
        let displayNotBoughtItems = notBoughtItems.map((item)=>{
              return (`<span class="product-item">
              ${item.name}
              <span class="circular-amount">${item.amount}</span>
              </span>`);
          });

        notBoughtItemsContainer.innerHTML=displayNotBoughtItems.join(' ');  
      }

    function RenderBoughtItems(){
          
        let displayBoughtItems = boughtItems.map((item)=>{
              return (`<span class="product-item crossed">
              ${item.name}
              <span class="circular-amount crossed">${item.amount}</span>
              </span>`);
          });

        boughtItemsContainer.innerHTML=displayBoughtItems.join(' ');  
    }

    function RenderProductList(){
        let displayItems = productList.map((item)=>{
            if(!item.bought){
              return (` <div class="item">
              <div class="first-column titles">
                  <span class="title" data-product-id="${item._id}">${item.name}</span>
                  <input class="input-text hiden" placeholder="Нова назва">
              </div>
              <div class="second-column add-buttons">
              <button class="decrement circular-button red-button" data-tooltip="Відняти одну одиницю" data-product-id="${item._id}"><b>-</b><span class="tooltip" data-tooltip="Відняти одну одиницю">Відняти одну одиницю</span></button>
              <span class="amount">${item.amount}</span>
              <button class="increment circular-button green-button" data-tooltip="Додати одну одиницю" data-product-id="${item._id}"><b>+</b><span class="tooltip" data-tooltip="Додати одну одиницю">Додати одну одиницю</span></button>   
              </div>
              <div class="third-column option-buttons">
              <button class="button-buy" data-product-name="${item.name}" data-tooltip="Відмітити як куплене" data-product-name="${item.name}" data-product-id="${item._id}" data-product-amount="${item.amount}">Куплено<span class="tooltip" data-tooltip="Відмітити як куплене">Відмітити як куплене</span></button>
              <button class="delete-button" data-product-name="${item.name}" data-product-id="${item._id}" data-tooltip="Видалити">X<span class="tooltip" data-tooltip="Видалити">Видалити</span></button>
              </div>
              </div>`);
            }
            else{
                return(` <div class="item">
                <div class="first-column titles">
                <span class="title crossed">${item.name}</span>
            </div>
            <div class="second-column add-buttons">                   
                <span class="amount">${item.amount}</span>
            </div>
            <div class="third-column option-buttons">
                <button class="button-not-bought" data-product-name="${item.name}" data-product-id="${item._id}" data-product-amount="${item.amount}">Не куплено<span class="tooltip" data-tooltip="Відмітити як не куплене">Відмітити як не куплене</span></button>
            </div>
            </div>`)
            }
          });
        

        itemsContainer.innerHTML=displayItems.join(' ');  
    }

    function GetElementPos(_array, _id){
        for(let i =0; i<_array.length;i++){
            if(_array[i]._id==_id)
                return i;
        }
    }

    function UpdateName(_id, newName){
        $.ajax({
            url: "/updateName",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({id:_id, name: newName}),
            success: function (response) {
                notBoughtItems[GetElementPos(notBoughtItems, _id)].name = newName;
                RenderNotBoughtItems();
            }
        }); 
    }

    function UpdateAmount(_id, newAmount){
        $.ajax({
            url: "/updateAmount",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({id:_id, amount: newAmount}),
            success: function (response) {
            }
        }); 
    }

    function UpdateStatus(_id, newStatus){
        $.ajax({
            url: "/updateStatus",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({id:_id, status: newStatus}),
            success: function (response) {
            }
        }); 
    }

    function GetProductList(){
        $.get({
			url: "/allProducts",
			contentType: "application/json",
			data: '',
			success: function (response) {
                if(response.length==0)
                    return;
                productList=response;
                productList.forEach(element => {
                    if(element.bought)
                        boughtItems.push(element);
                    else
                        notBoughtItems.push(element);
                });
                RenderProductList();
                RenderNotBoughtItems();
                RenderBoughtItems();
			   }
		});
    }
    
    GetProductList();
}
