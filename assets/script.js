//const address = '192.168.0.6'; //You may change this to localhost or 127.0.0.1 if you're not using a wi-fi connection.
//const baseURL = `http://${address}:3000/medic`;
const baseURL = `https://medicbank-server.herokuapp.com/medic`;

async function findAllMedics() {
  //Here we push our medic list data into HTML.
  const response = await fetch(`${baseURL}/find-medics`);
  const medics = await response.json();

  const medicList = document.querySelector('#medicList');
  medicList.innerHTML = '';

  medics.forEach(function (item) {
    medicList.insertAdjacentHTML(
      'beforeend',
      `
       <div id="medic${item._id}" onclick="findMedicById('${item._id}'); openModalDetails();" class="flex flex-col items-center gap-4 p-2 rounded bg-blue-500 shadow-lg shadow-blue-500/80 transition delay-300 duration-300 ease-in-out hover:scale-105 cursor-pointer">
          <img
            src="./assets/foto.jpg"
            alt="image not loaded"
          />
          <div>
            <p>${item.name}</p>
            <p>CRM: ${item.CRM}</p>
          </div>
        </div>
       `,
    );
  });
}

findAllMedics();

async function findMedicById(idMedic) {
  const response = await fetch(`${baseURL}/find-medics/${idMedic}`);
  const medic = await response.json();

  let specialties = '';
  medic.specialties.forEach(function (specialty) {
    specialties += `<p>${specialty}</p>`;
  });

  const chosenMedicDiv = document.querySelector('#chosenMedic');
  chosenMedicDiv.innerHTML = `
  <div id="modalDetails" class="flex z-[9999] absolute left-[50%] top-[65%] translate-x-[-50%] translate-y-[-50%] flex-col justify-center gap-2 p-2 rounded bg-blue-500 shadow-lg shadow-blue-500/80">
      <div class="flex flex-row items-center justify-between">
      <p>${medic.name}</p>
      <a
        onclick="closeModalDetails()"
        class="mx-2 text-red-500 text-2xl transition-all ease-out duration-150 hover:scale-150 cursor-pointer"
      >x</a>
      </div>
      <img
        src="./assets/foto.jpg"
        alt="image not loaded"
        class="object-cover w-60"
      />
    
    <div>
      <p>CRM: ${medic.CRM}</p>
      <p>Landline: ${medic.landline}</p>
      <p>Phone Number: ${medic.phoneNumber}</p>
      <p>CEP: ${medic.CEP}</p>
      <p>Specialties:</p>
      ${specialties}
    </div>
    <div class="flex justify-around">
      <button
        onclick="openModalRegisterUpdate('update', '${idMedic}')"
        class="m-2 p-3 rounded bg-blue-800 shadow-lg shadow-blue-800/80 transition duration-300 ease-in-out hover:scale-110"
      >
        UPDATE
      </button>
      <button
        onclick="deleteMedic('${idMedic}')"
        class="m-2 p-3 rounded bg-red-500 shadow-lg shadow-red-500/80 transition duration-300 ease-in-out hover:scale-110"
      >
        DELETE
      </button>
    </div>
  </div>
  `;
}

function openModalDetails() {
  document.querySelector('#medicList').style.filter = 'blur(24px)';
  document.querySelector('header').style.filter = 'blur(24px)';
}

function closeModalDetails() {
  document.querySelector('#modalDetails').style.display = 'none';
  document.querySelector('#medicList').style.filter = 'blur(0)';
  document.querySelector('header').style.filter = 'blur(0)';
}

function clearInputs() {
  document.querySelector('#name').value = '';
  document.querySelector('#crm').value = '';
  document.querySelector('#landline').value = '';
  document.querySelector('#phoneNumber').value = '';
  document.querySelector('#cep').value = '';
  document.querySelector('input[name=alergology]').checked = false;
  document.querySelector('input[name=angiology]').checked = false;
  document.querySelector('input[name=bucoMaxillo]').checked = false;
  document.querySelector('input[name=clinicCardiology]').checked = false;
  document.querySelector('input[name=childrensCardiology]').checked = false;
  document.querySelector('input[name=headNeckSurgery]').checked = false;
  document.querySelector('input[name=cardiacSurgery]').checked = false;
  document.querySelector('input[name=chestSurgery]').checked = false;
}

async function openModalRegisterUpdate(status, idMedic) {
  clearInputs();

  document.querySelector('#overlay').style.display = 'block';
  const registerTitle = document.querySelector('#registerTitle');
  const updateTitle = document.querySelector('#updateTitle');
  const registerUpdateButton = document.querySelector('#registerUpdateButton');

  if (status == 'register') {
    registerTitle.style.display = 'block';
    updateTitle.style.display = 'none';
    registerUpdateButton.innerHTML = `
    <button
      onclick="registerUpdateMedic('register')"
      class="bg-blue-800 shadow-lg shadow-blue-800/80 p-2 rounded transition-all ease-in-out duration-300 hover:scale-105"
    >
      SUBMIT
    </button>
    `;
  }

  if (status == 'update') {
    registerTitle.style.display = 'none';
    updateTitle.style.display = 'block';
    registerUpdateButton.innerHTML = `
    <button
      onclick="registerUpdateMedic('update', '${idMedic}')"
      class="bg-blue-800 shadow-lg shadow-blue-800/80 p-2 rounded transition-all ease-in-out duration-300 hover:scale-105"
    >
      UPDATE
    </button>
    `;

    const response = await fetch(`${baseURL}/find-medics/${idMedic}`);
    const medic = await response.json();

    document.querySelector('#name').value = medic.name;
    document.querySelector('#crm').value = medic.CRM;
    document.querySelector('#landline').value = medic.landline;
    document.querySelector('#phoneNumber').value = medic.phoneNumber;
    document.querySelector('#cep').value = medic.CEP;

    if (medic.specialties.find((specialty) => specialty == 'Alergology'))
      document.querySelector('input[name=alergology]').checked = true;

    if (medic.specialties.find((specialty) => specialty == 'Angiology'))
      document.querySelector('input[name=angiology]').checked = true;

    if (medic.specialties.find((specialty) => specialty == 'Buco maxillo'))
      document.querySelector('input[name=bucoMaxillo]').checked = true;

    if (medic.specialties.find((specialty) => specialty == 'Clinic cardiology'))
      document.querySelector('input[name=clinicCardiology]').checked = true;

    if (
      medic.specialties.find(
        (specialty) => specialty == `Children's cardiology`,
      )
    )
      document.querySelector('input[name=childrensCardiology]').checked = true;

    if (
      medic.specialties.find(
        (specialty) => specialty == 'Head and neck surgery',
      )
    )
      document.querySelector('input[name=headNeckSurgery]').checked = true;

    if (medic.specialties.find((specialty) => specialty == 'Cardiac surgery'))
      document.querySelector('input[name=cardiacSurgery]').checked = true;

    if (medic.specialties.find((specialty) => specialty == 'Chest surgery'))
      document.querySelector('input[name=chestSurgery]').checked = true;
  }

  const modalDetails = document.querySelector('#modalDetails');
  if (modalDetails) modalDetails.style.display = 'none';

  document.querySelector('#medicList').style.filter = 'blur(24px)';
  document.querySelector('header').style.filter = 'blur(24px)';
}

function closeModalRegisterUpdate() {
  document.querySelector('#overlay').style.display = 'none';
  document.querySelector('#registerTitle').style.display = 'none';
  document.querySelector('#updateTitle').style.display = 'none';
  document.querySelector('#medicList').style.filter = 'blur(0)';
  document.querySelector('header').style.filter = 'blur(0)';

  clearInputs();
}

async function registerUpdateMedic(status, idMedic) {
  const name = document.querySelector('#name').value;
  const CRM = document.querySelector('#crm').value;
  const landline = document.querySelector('#landline').value;
  const phoneNumber = document.querySelector('#phoneNumber').value;
  const CEP = document.querySelector('#cep').value;
  const specialties = [];

  const inputsNames = [
    'alergology',
    'angiology',
    'bucoMaxillo',
    'clinicCardiology',
    'childrensCardiology',
    'headNeckSurgery',
    'cardiacSurgery',
    'chestSurgery',
  ];
  for (let i = 0; i < inputsNames.length; i++)
    document.querySelector(`input[name=${inputsNames[i]}]`).checked &&
      specialties.push(
        document.querySelector(`input[name=${inputsNames[i]}]`).value,
      );
  // (a && b) is equivalent to if(a){ b }

  const medic = { name, CRM, landline, phoneNumber, CEP, specialties };

  let endpoint = '';
  if (status == 'register') endpoint = baseURL + '/create';
  if (status == 'update') endpoint = baseURL + `/update/${idMedic}`;
  const method = status == 'register' ? 'post' : status == 'update' && `put`;

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(medic),
  });

  //This if statement prevents of invalid data be shown on screen.
  if (response.status != 400) findAllMedics();

  closeModalRegisterUpdate();
}

async function deleteMedic(idMedic) {
  const response = await fetch(`${baseURL}/delete/${idMedic}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });
  const result = await response.json();
  console.log(result.message);

  findAllMedics();
  closeModalDetails();
}
