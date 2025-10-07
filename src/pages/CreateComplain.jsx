export const CreateComplain = () => {
  return (
    <>
      <div className="bg-blue-500 flex justify-between item-center p-2 mb-4">
        <h4 className="font-bold text-white text-lg">Register Complain</h4>
      </div>
      <div class="grid gap-6 mb-6 md:grid-cols-1">
        <div class="relative">
          <input
            type="text"
            id="floating_subject"
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
            placeholder=""
          />
          <label
            for="floating_subject"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Subject <span className="text-red-600">*</span>
          </label>
        </div>
        <div class="relative">
          <input
            type="textarea"
            id="floating_description"
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
            placeholder=""
          />
          <label
            for="floating_description"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Description <span className="text-red-600">*</span>
          </label>
        </div>
        <div class="relative">
          <input
            type="file"
            id="floating_image"
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none peer"
            placeholder=""
          />
          <label
            for="floating_image"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Image Of Issue <span className="text-red-600">*</span>
          </label>
        </div>
      </div>

      <button
        type="button"
        class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Submit
      </button>
    </>
  );
};
