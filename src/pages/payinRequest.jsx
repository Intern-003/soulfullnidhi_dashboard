import React, { useState } from 'react';

const Payinrequest = () => {
    const [showModal, setShowModal] = useState(false);
  
  return (

    <div >      

      {/* Form Section */}
       <div className="bg-white shadow-md rounded-lg shadow-lg shadow-gray-900/100"> 
        <div className=" flex justify-between items-center p-2 mb-4 rounded-t-lg">
          <h4 className="font-bold text-blue-500 text-lg py-2 ml-4">Request For Payment</h4>
        </div>
          
        <div className="bg-white shadow-md rounded-lg shadow-lg shadow-gray-900/50 mx-auto mt-4 p-4 max-w-xl">
        <div className="bg-blue-500 text-white font-bold text-lg px-4 py-2 rounded mb-4" style={{
              background: "linear-gradient(90deg, #007BFF, #00C8FF)",
              color: "white",
            }}>
            Create New Payment
        </div>
    
        
        <div class="grid md:grid-cols-2 md:gap-6 px-4">
          <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="payer_name" id="payer_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="Payer_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Payer Name</label>
          </div>       
          <div class="relative z-0 w-full mb-5 group">
             <input type="number" name="amount" id="amount" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
             <label for="amount" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Amount</label>
          </div>
        </div>
        <div class="grid md:grid-cols-2 md:gap-6 px-4">
          <div class="relative z-0 w-full mb-5 group">
              <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="payer_mobile" id="payer_mobile" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="payer_mobile" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Payer Mobile Number</label>
          </div>             
          <div class="relative z-0 w-full mb-5 group">
              <input type="text" name="payer_email" id="payer_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label for="payer_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Payer Email Id</label>
          </div>    
        </div >
        
        <div class="flex justify-center mt-2 py-2">
            <button type="submit" onClick={() => window.location.href = "https://live.spay.live/payment"} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
        
        </div>
       </div> 
     
      

      
    </div>


  );
};

export default Payinrequest;
