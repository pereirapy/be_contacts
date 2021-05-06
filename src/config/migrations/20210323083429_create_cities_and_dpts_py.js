const tableNameDpts = 'departments'
const tableNameCities = 'cities'
const tableNameContacts = 'contacts'

exports.up = async function(knex) {
  await knex.schema
    .createTable(tableNameDpts, function(table) {
      table.increments()
      table
        .string('name')
        .notNullable()
        .unique()
      table
        .string('capital')
        .notNullable()
        .unique()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
    })
    .createTable(tableNameCities, function(table) {
      table.increments()
      table
        .string('name')
        .notNullable()
        .unique()
      table.integer('idDepartment').notNullable()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
      table
        .foreign('idDepartment')
        .references('id')
        .inTable(tableNameDpts)
    })

  await knex(tableNameDpts).insert([
    {
      id: 1,
      name: 'Central',
      capital: 'Areguá'
    },
    {
      id: 2,
      name: 'Concepción',
      capital: 'Concepción'
    },
    {
      id: 3,
      name: 'San Pedro',
      capital: 'San Pedro de Ycuamandiyú'
    },
    {
      id: 4,
      name: 'Coordillera',
      capital: 'Caacupé'
    },
    {
      id: 5,
      name: 'Guairá',
      capital: 'Villarica'
    },
    {
      id: 6,
      name: 'Caaguazú',
      capital: 'Coronel Oviedo'
    },
    {
      id: 7,
      name: 'Caazapá',
      capital: 'Caazapá'
    },
    {
      id: 8,
      name: 'Itapúa',
      capital: 'Encarnación'
    },
    {
      id: 9,
      name: 'Misiones',
      capital: 'San Juan Bautista'
    },
    {
      id: 10,
      name: 'Paraguarí',
      capital: 'Paraguarí'
    },
    {
      id: 11,
      name: 'Alto Paraná',
      capital: 'Ciudad del Este'
    },
    {
      id: 12,
      name: 'Ñeembucú',
      capital: 'Pilar'
    },
    {
      id: 13,
      name: 'Amambay',
      capital: 'Pedro Juan Caballero'
    },
    {
      id: 14,
      name: 'Canindeyú',
      capital: 'Salto del Guairá'
    },
    {
      id: 15,
      name: 'Presidente Hayes',
      capital: 'Villa Hayes'
    },
    {
      id: 16,
      name: 'Boquerón',
      capital: 'Filadelfia'
    },
    {
      id: 17,
      name: 'Alto Paraguay',
      capital: 'Fuerte Olimpo'
    }
  ])
  await knex(tableNameCities).insert([
    {
      id: 1,
      idDepartment: 1,
      name: 'Asunción'
    },
    {
      id: 2,
      idDepartment: 17,
      name: 'Bahía Negra'
    },
    {
      id: 3,
      idDepartment: 17,
      name: 'Carmelo Peralta'
    },
    {
      id: 4,
      idDepartment: 17,
      name: 'Puerto Casado'
    },
    {
      id: 5,
      idDepartment: 17,
      name: 'Fuerte Olimpo'
    },
    {
      id: 6,
      idDepartment: 11,
      name: 'Ciudad del Este'
    },
    {
      id: 7,
      idDepartment: 11,
      name: 'Doctor Juan León Mallorquín'
    },
    {
      id: 8,
      idDepartment: 11,
      name: 'Doctor Raúl Peña'
    },
    {
      id: 9,
      idDepartment: 11,
      name: 'Domingo Martínez de Irala'
    },
    {
      id: 10,
      idDepartment: 11,
      name: 'Hernandarias'
    },
    {
      id: 11,
      idDepartment: 11,
      name: 'Iruña'
    },
    {
      id: 12,
      idDepartment: 11,
      name: 'Itakyry'
    },
    {
      id: 13,
      idDepartment: 11,
      name: 'Juan E. O´Leary'
    },
    {
      id: 14,
      idDepartment: 11,
      name: 'Los Cedrales'
    },
    {
      id: 15,
      idDepartment: 11,
      name: 'Mbaracayú'
    },
    {
      id: 16,
      idDepartment: 11,
      name: 'Minga Guazú'
    },
    {
      id: 17,
      idDepartment: 11,
      name: 'Minga Porá'
    },
    {
      id: 18,
      idDepartment: 11,
      name: 'Naranjal'
    },
    {
      id: 19,
      idDepartment: 11,
      name: 'Ñacunday'
    },
    {
      id: 20,
      idDepartment: 11,
      name: 'Presidente Franco'
    },
    {
      id: 21,
      idDepartment: 11,
      name: 'San Alberto'
    },
    {
      id: 22,
      idDepartment: 11,
      name: 'San Cristóbal'
    },
    {
      id: 23,
      idDepartment: 11,
      name: 'Santa Fe del Paraná'
    },
    {
      id: 24,
      idDepartment: 11,
      name: 'Santa Rita'
    },
    {
      id: 25,
      idDepartment: 11,
      name: 'Santa Rosa del Monday'
    },
    {
      id: 26,
      idDepartment: 11,
      name: 'Tavapy'
    },
    {
      id: 27,
      idDepartment: 11,
      name: 'Colonia Yguazú'
    },
    {
      id: 28,
      idDepartment: 13,
      name: 'Bella Vista Norte'
    },
    {
      id: 29,
      idDepartment: 13,
      name: 'Capitán Bado'
    },
    {
      id: 30,
      idDepartment: 13,
      name: 'Pedro Juan Caballero'
    },
    {
      id: 31,
      idDepartment: 13,
      name: 'Zanja Pytá'
    },
    {
      id: 32,
      idDepartment: 13,
      name: 'Karapaí'
    },
    {
      id: 33,
      idDepartment: 16,
      name: 'Filadelfia'
    },
    {
      id: 34,
      idDepartment: 16,
      name: 'Loma Plata'
    },
    {
      id: 35,
      idDepartment: 16,
      name: 'Mcal. Estigarribia'
    },
    {
      id: 36,
      idDepartment: 6,
      name: 'Caaguazú'
    },
    {
      id: 37,
      idDepartment: 6,
      name: 'Carayaó'
    },
    {
      id: 38,
      idDepartment: 6,
      name: 'Cnel. Oviedo'
    },
    {
      id: 39,
      idDepartment: 6,
      name: 'Doctor Cecilio Báez'
    },
    {
      id: 40,
      idDepartment: 6,
      name: 'J.E. Estigarribia'
    },
    {
      id: 41,
      idDepartment: 6,
      name: 'Campo 9'
    },
    {
      id: 42,
      idDepartment: 6,
      name: 'Doctor Juan Manuel Frutos'
    },
    {
      id: 43,
      idDepartment: 6,
      name: 'José Domingo Ocampos'
    },
    {
      id: 44,
      idDepartment: 6,
      name: 'La Pastora'
    },
    {
      id: 45,
      idDepartment: 6,
      name: 'Mcal. Francisco S. López'
    },
    {
      id: 46,
      idDepartment: 6,
      name: 'Nueva Londres'
    },
    {
      id: 47,
      idDepartment: 6,
      name: 'Nueva Toledo'
    },
    {
      id: 48,
      idDepartment: 6,
      name: 'Raúl Arsenio Oviedo'
    },
    {
      id: 49,
      idDepartment: 6,
      name: 'Repatriación'
    },
    {
      id: 50,
      idDepartment: 6,
      name: 'R. I. Tres Corrales'
    },
    {
      id: 51,
      idDepartment: 6,
      name: 'San Joaquín'
    },
    {
      id: 52,
      idDepartment: 6,
      name: 'San José de los Arroyos'
    },
    {
      id: 53,
      idDepartment: 6,
      name: 'Mbutuy'
    },
    {
      id: 54,
      idDepartment: 6,
      name: 'Simón Bolívar'
    },
    {
      id: 55,
      idDepartment: 6,
      name: 'Tembiaporá'
    },
    {
      id: 56,
      idDepartment: 6,
      name: 'Tres de Febrero'
    },
    {
      id: 57,
      idDepartment: 6,
      name: 'Vaquería'
    },
    {
      id: 58,
      idDepartment: 6,
      name: 'Yhú'
    },
    {
      id: 59,
      idDepartment: 7,
      name: '3 de Mayo'
    },
    {
      id: 60,
      idDepartment: 7,
      name: 'Abaí'
    },
    {
      id: 61,
      idDepartment: 7,
      name: 'Buena Vista'
    },
    {
      id: 62,
      idDepartment: 7,
      name: 'Caazapá'
    },
    {
      id: 63,
      idDepartment: 7,
      name: 'Doctor Moisés S. Bertoni'
    },
    {
      id: 64,
      idDepartment: 7,
      name: 'Fulgencio Yegros'
    },
    {
      id: 65,
      idDepartment: 7,
      name: 'General Higinio Morínigo'
    },
    {
      id: 66,
      idDepartment: 7,
      name: 'Maciel'
    },
    {
      id: 67,
      idDepartment: 7,
      name: 'San Juan Nepomuceno'
    },
    {
      id: 68,
      idDepartment: 7,
      name: 'Tavaí'
    },
    {
      id: 69,
      idDepartment: 7,
      name: 'Yuty'
    },
    {
      id: 70,
      idDepartment: 14,
      name: 'Colonia Anahí'
    },
    {
      id: 71,
      idDepartment: 14,
      name: 'Corpus Christi'
    },
    {
      id: 72,
      idDepartment: 14,
      name: 'Curuguaty'
    },
    {
      id: 73,
      idDepartment: 14,
      name: 'Gral. Francisco Caballero Álvarez'
    },
    {
      id: 74,
      idDepartment: 14,
      name: 'Itanará'
    },
    {
      id: 75,
      idDepartment: 14,
      name: 'Katueté'
    },
    {
      id: 76,
      idDepartment: 14,
      name: 'La Paloma'
    },
    {
      id: 77,
      idDepartment: 14,
      name: 'Maracaná'
    },
    {
      id: 78,
      idDepartment: 14,
      name: 'Nueva Esperanza'
    },
    {
      id: 79,
      idDepartment: 14,
      name: 'Salto del Guairá'
    },
    {
      id: 80,
      idDepartment: 14,
      name: 'Villa Ygatimí'
    },
    {
      id: 81,
      idDepartment: 14,
      name: 'Yasy Cañy'
    },
    {
      id: 82,
      idDepartment: 14,
      name: 'Ybyrarovaná'
    },
    {
      id: 83,
      idDepartment: 14,
      name: 'Ypejhú'
    },
    {
      id: 84,
      idDepartment: 14,
      name: 'Yby Pytá'
    },
    {
      id: 85,
      idDepartment: 1,
      name: 'Areguá'
    },
    {
      id: 86,
      idDepartment: 1,
      name: 'Capiatá'
    },
    {
      id: 87,
      idDepartment: 1,
      name: 'Fernando de la Mora'
    },
    {
      id: 88,
      idDepartment: 1,
      name: 'Guarambaré'
    },
    {
      id: 89,
      idDepartment: 1,
      name: 'Itá'
    },
    {
      id: 90,
      idDepartment: 1,
      name: 'Itauguá'
    },
    {
      id: 91,
      idDepartment: 1,
      name: 'J. Augusto Saldivar'
    },
    {
      id: 92,
      idDepartment: 1,
      name: 'Lambaré'
    },
    {
      id: 93,
      idDepartment: 1,
      name: 'Limpio'
    },
    {
      id: 94,
      idDepartment: 1,
      name: 'Luque'
    },
    {
      id: 95,
      idDepartment: 1,
      name: 'Mariano Roque Alonso'
    },
    {
      id: 96,
      idDepartment: 1,
      name: 'Ñemby'
    },
    {
      id: 97,
      idDepartment: 1,
      name: 'Nueva Italia'
    },
    {
      id: 98,
      idDepartment: 1,
      name: 'San Antonio'
    },
    {
      id: 99,
      idDepartment: 1,
      name: 'San Lorenzo'
    },
    {
      id: 100,
      idDepartment: 1,
      name: 'Villa Elisa'
    },
    {
      id: 101,
      idDepartment: 1,
      name: 'Villeta'
    },
    {
      id: 102,
      idDepartment: 1,
      name: 'Ypacaraí'
    },
    {
      id: 103,
      idDepartment: 1,
      name: 'Ypané'
    },
    {
      id: 104,
      idDepartment: 2,
      name: 'Arroyito'
    },
    {
      id: 105,
      idDepartment: 2,
      name: 'Azotey'
    },
    {
      id: 106,
      idDepartment: 2,
      name: 'Belén'
    },
    {
      id: 107,
      idDepartment: 2,
      name: 'Concepción'
    },
    {
      id: 108,
      idDepartment: 2,
      name: 'Horqueta'
    },
    {
      id: 109,
      idDepartment: 2,
      name: 'Loreto'
    },
    {
      id: 110,
      idDepartment: 2,
      name: 'San Carlos del Apa'
    },
    {
      id: 111,
      idDepartment: 2,
      name: 'San Lázaro'
    },
    {
      id: 112,
      idDepartment: 2,
      name: 'Yby Yaú'
    },
    {
      id: 113,
      idDepartment: 2,
      name: 'Sargento José Félix López'
    },
    {
      id: 114,
      idDepartment: 2,
      name: 'San Alfredo'
    },
    {
      id: 115,
      idDepartment: 2,
      name: 'Paso Barreto'
    },
    {
      id: 116,
      idDepartment: 4,
      name: 'Altos'
    },
    {
      id: 117,
      idDepartment: 4,
      name: 'Arroyos y Esteros'
    },
    {
      id: 118,
      idDepartment: 4,
      name: 'Atyrá'
    },
    {
      id: 119,
      idDepartment: 4,
      name: 'Caacupé'
    },
    {
      id: 120,
      idDepartment: 4,
      name: 'Caraguatay'
    },
    {
      id: 121,
      idDepartment: 4,
      name: 'Emboscada'
    },
    {
      id: 122,
      idDepartment: 4,
      name: 'Eusebio Ayala'
    },
    {
      id: 123,
      idDepartment: 4,
      name: 'Isla Pucú'
    },
    {
      id: 124,
      idDepartment: 4,
      name: 'Itacurubí'
    },
    {
      id: 125,
      idDepartment: 4,
      name: 'Juan de Mena'
    },
    {
      id: 126,
      idDepartment: 4,
      name: 'Loma Grande'
    },
    {
      id: 127,
      idDepartment: 4,
      name: 'Mbocayaty del Yhaguy'
    },
    {
      id: 128,
      idDepartment: 4,
      name: 'Nueva Colombia'
    },
    {
      id: 129,
      idDepartment: 4,
      name: 'Piribebuy'
    },
    {
      id: 130,
      idDepartment: 4,
      name: 'Primero de Marzo'
    },
    {
      id: 131,
      idDepartment: 4,
      name: 'San Bernardino'
    },
    {
      id: 132,
      idDepartment: 4,
      name: 'San José Obrero'
    },
    {
      id: 133,
      idDepartment: 4,
      name: 'Santa Elena'
    },
    {
      id: 134,
      idDepartment: 4,
      name: 'Tobatí'
    },
    {
      id: 135,
      idDepartment: 4,
      name: 'Valenzuela'
    },
    {
      id: 136,
      idDepartment: 5,
      name: 'Borja'
    },
    {
      id: 137,
      idDepartment: 5,
      name: 'Colonia Independencia'
    },
    {
      id: 138,
      idDepartment: 5,
      name: 'Coronel Martínez'
    },
    {
      id: 139,
      idDepartment: 5,
      name: 'Dr. Bottrell'
    },
    {
      id: 140,
      idDepartment: 5,
      name: 'Fassardi'
    },
    {
      id: 141,
      idDepartment: 5,
      name: 'Félix Pérez Cardozo'
    },
    {
      id: 142,
      idDepartment: 5,
      name: 'Garay'
    },
    {
      id: 143,
      idDepartment: 5,
      name: 'Itapé'
    },
    {
      id: 144,
      idDepartment: 5,
      name: 'Iturbe'
    },
    {
      id: 145,
      idDepartment: 5,
      name: 'Mbocayaty'
    },
    {
      id: 146,
      idDepartment: 5,
      name: 'Natalicio Talavera'
    },
    {
      id: 147,
      idDepartment: 5,
      name: 'Ñumí'
    },
    {
      id: 148,
      idDepartment: 5,
      name: 'Paso Yobái'
    },
    {
      id: 149,
      idDepartment: 5,
      name: 'San Salvador'
    },
    {
      id: 150,
      idDepartment: 5,
      name: 'Tebicuary'
    },
    {
      id: 151,
      idDepartment: 5,
      name: 'Troche'
    },
    {
      id: 152,
      idDepartment: 5,
      name: 'Villarrica'
    },
    {
      id: 153,
      idDepartment: 5,
      name: 'Yataity'
    },
    {
      id: 154,
      idDepartment: 8,
      name: 'Alto Verá'
    },
    {
      id: 155,
      idDepartment: 8,
      name: 'Bella Vista'
    },
    {
      id: 156,
      idDepartment: 8,
      name: 'Cambyretá'
    },
    {
      id: 157,
      idDepartment: 8,
      name: 'Capitán Meza'
    },
    {
      id: 158,
      idDepartment: 8,
      name: 'Capitán Miranda'
    },
    {
      id: 159,
      idDepartment: 8,
      name: 'Carlos Antonio López'
    },
    {
      id: 160,
      idDepartment: 8,
      name: 'Carmen del Paraná'
    },
    {
      id: 161,
      idDepartment: 8,
      name: 'Coronel Bogado'
    },
    {
      id: 162,
      idDepartment: 8,
      name: 'Edelira'
    },
    {
      id: 163,
      idDepartment: 8,
      name: 'Encarnación'
    },
    {
      id: 164,
      idDepartment: 8,
      name: 'Fram'
    },
    {
      id: 165,
      idDepartment: 8,
      name: 'General Artigas'
    },
    {
      id: 166,
      idDepartment: 8,
      name: 'General Delgado'
    },
    {
      id: 167,
      idDepartment: 8,
      name: 'Hohenau'
    },
    {
      id: 168,
      idDepartment: 8,
      name: 'Itapúa Poty'
    },
    {
      id: 169,
      idDepartment: 8,
      name: 'Jesús'
    },
    {
      id: 170,
      idDepartment: 8,
      name: 'Colonia La Paz'
    },
    {
      id: 171,
      idDepartment: 8,
      name: 'José Leandro Oviedo'
    },
    {
      id: 172,
      idDepartment: 8,
      name: 'Mayor Otaño'
    },
    {
      id: 173,
      idDepartment: 8,
      name: 'Natalio'
    },
    {
      id: 174,
      idDepartment: 8,
      name: 'Nueva Alborada'
    },
    {
      id: 175,
      idDepartment: 8,
      name: 'Obligado'
    },
    {
      id: 176,
      idDepartment: 8,
      name: 'Pirapó'
    },
    {
      id: 177,
      idDepartment: 8,
      name: 'San Cosme y Damián'
    },
    {
      id: 178,
      idDepartment: 8,
      name: 'San Juan del Paraná'
    },
    {
      id: 179,
      idDepartment: 8,
      name: 'San Pedro del Paraná'
    },
    {
      id: 180,
      idDepartment: 8,
      name: 'San Rafael del Paraná'
    },
    {
      id: 181,
      idDepartment: 8,
      name: 'Maria Auxiliadora'
    },
    {
      id: 182,
      idDepartment: 8,
      name: 'Trinidad'
    },
    {
      id: 183,
      idDepartment: 8,
      name: 'Yatytay'
    },
    {
      id: 184,
      idDepartment: 9,
      name: 'Ayolas'
    },
    {
      id: 185,
      idDepartment: 9,
      name: 'San Ignacio'
    },
    {
      id: 186,
      idDepartment: 9,
      name: 'San Juan Bautista'
    },
    {
      id: 187,
      idDepartment: 9,
      name: 'San Miguel'
    },
    {
      id: 188,
      idDepartment: 9,
      name: 'San Patricio'
    },
    {
      id: 189,
      idDepartment: 9,
      name: 'Santa María'
    },
    {
      id: 190,
      idDepartment: 9,
      name: 'Santa Rosa'
    },
    {
      id: 191,
      idDepartment: 9,
      name: 'Santiago'
    },
    {
      id: 192,
      idDepartment: 9,
      name: 'Villa Florida'
    },
    {
      id: 193,
      idDepartment: 9,
      name: 'Yabebyry'
    },
    {
      id: 194,
      idDepartment: 12,
      name: 'Alberdi'
    },
    {
      id: 195,
      idDepartment: 12,
      name: 'Cerrito'
    },
    {
      id: 196,
      idDepartment: 12,
      name: 'Desmochados'
    },
    {
      id: 197,
      idDepartment: 12,
      name: 'General José Eduvigis Díaz'
    },
    {
      id: 198,
      idDepartment: 12,
      name: 'Guazú Cuá'
    },
    {
      id: 199,
      idDepartment: 12,
      name: 'Humaitá'
    },
    {
      id: 200,
      idDepartment: 12,
      name: 'Isla Umbú'
    },
    {
      id: 201,
      idDepartment: 12,
      name: 'Laureles'
    },
    {
      id: 202,
      idDepartment: 12,
      name: 'Mayor José J. Martínez'
    },
    {
      id: 203,
      idDepartment: 12,
      name: 'Paso de Patria'
    },
    {
      id: 204,
      idDepartment: 12,
      name: 'Pilar'
    },
    {
      id: 205,
      idDepartment: 12,
      name: 'San Juan Bautista del Ñeembucú'
    },
    {
      id: 206,
      idDepartment: 12,
      name: 'Tacuaras'
    },
    {
      id: 207,
      idDepartment: 12,
      name: 'Villa Franca'
    },
    {
      id: 208,
      idDepartment: 12,
      name: 'Villalbín'
    },
    {
      id: 209,
      idDepartment: 12,
      name: 'Villa Oliva'
    },
    {
      id: 210,
      idDepartment: 10,
      name: 'Acahay'
    },
    {
      id: 211,
      idDepartment: 10,
      name: 'Caapucú'
    },
    {
      id: 212,
      idDepartment: 10,
      name: 'Carapeguá'
    },
    {
      id: 213,
      idDepartment: 10,
      name: 'Escobar'
    },
    {
      id: 214,
      idDepartment: 10,
      name: 'Gral. Bernardino Caballero'
    },
    {
      id: 215,
      idDepartment: 10,
      name: 'La Colmena'
    },
    {
      id: 216,
      idDepartment: 10,
      name: 'María Antonia'
    },
    {
      id: 217,
      idDepartment: 10,
      name: 'Mbuyapey'
    },
    {
      id: 218,
      idDepartment: 10,
      name: 'Paraguarí'
    },
    {
      id: 219,
      idDepartment: 10,
      name: 'Pirayú'
    },
    {
      id: 220,
      idDepartment: 10,
      name: 'Quiindy'
    },
    {
      id: 221,
      idDepartment: 10,
      name: 'Quyquyhó'
    },
    {
      id: 222,
      idDepartment: 10,
      name: 'San Roque González de Santa Cruz'
    },
    {
      id: 223,
      idDepartment: 10,
      name: 'Sapucai'
    },
    {
      id: 224,
      idDepartment: 10,
      name: 'Tebicuarymí'
    },
    {
      id: 225,
      idDepartment: 10,
      name: 'Yaguarón'
    },
    {
      id: 226,
      idDepartment: 10,
      name: 'Ybycuí'
    },
    {
      id: 227,
      idDepartment: 10,
      name: 'Ybytymí'
    },
    {
      id: 228,
      idDepartment: 15,
      name: 'Benjamín Aceval'
    },
    {
      id: 229,
      idDepartment: 15,
      name: 'Dr. José Falcón'
    },
    {
      id: 230,
      idDepartment: 15,
      name: 'General José María Bruguez'
    },
    {
      id: 231,
      idDepartment: 15,
      name: 'Nanawa'
    },
    {
      id: 232,
      idDepartment: 15,
      name: 'Colonia Paratodo'
    },
    {
      id: 233,
      idDepartment: 15,
      name: 'Pozo Colorado'
    },
    {
      id: 234,
      idDepartment: 15,
      name: 'Puerto Pinasco'
    },
    {
      id: 235,
      idDepartment: 15,
      name: 'Tte. Irala Fernández'
    },
    {
      id: 236,
      idDepartment: 15,
      name: 'Esteban Martínez'
    },
    {
      id: 237,
      idDepartment: 15,
      name: 'Villa Hayes'
    },
    {
      id: 238,
      idDepartment: 3,
      name: 'Antequera'
    },
    {
      id: 239,
      idDepartment: 3,
      name: 'Capiibary'
    },
    {
      id: 240,
      idDepartment: 3,
      name: 'Choré'
    },
    {
      id: 241,
      idDepartment: 3,
      name: 'General Elizardo Aquino'
    },
    {
      id: 242,
      idDepartment: 3,
      name: 'General Isidoro Resquín'
    },
    {
      id: 243,
      idDepartment: 3,
      name: 'Guayaibí'
    },
    {
      id: 244,
      idDepartment: 3,
      name: 'Itacurubí del Rosario'
    },
    {
      id: 245,
      idDepartment: 3,
      name: 'Liberación'
    },
    {
      id: 246,
      idDepartment: 3,
      name: 'Lima'
    },
    {
      id: 247,
      idDepartment: 3,
      name: 'Rio Verde'
    },
    {
      id: 248,
      idDepartment: 3,
      name: 'Nueva Germania'
    },
    {
      id: 249,
      idDepartment: 3,
      name: 'San Estanislao'
    },
    {
      id: 250,
      idDepartment: 3,
      name: 'San Pablo'
    },
    {
      id: 251,
      idDepartment: 3,
      name: 'Villa de San Pedro'
    },
    {
      id: 252,
      idDepartment: 3,
      name: 'San Vicente Pancholo'
    },
    {
      id: 253,
      idDepartment: 3,
      name: 'Santa Rosa del Aguaray'
    },
    {
      id: 254,
      idDepartment: 3,
      name: 'Tacuatí'
    },
    {
      id: 255,
      idDepartment: 3,
      name: 'Unión'
    },
    {
      id: 256,
      idDepartment: 3,
      name: '25 de Diciembre'
    },
    {
      id: 257,
      idDepartment: 3,
      name: 'Villa del Rosario'
    },
    {
      id: 258,
      idDepartment: 3,
      name: 'Yataity del Norte'
    },
    {
      id: 259,
      idDepartment: 3,
      name: 'Yrybucuá'
    }
  ])

  await knex(tableNameContacts)
    .update('location', 24)
    .where('location', 'ilike', `santa%`)

  await knex(tableNameContacts)
    .update('location', 18)
    .where('location', 'ilike', `%NARANJAL%`)

  await knex(tableNameContacts)
    .update('location', 6)
    .where('location', 'ilike', `%Cidade Del Este%`)

  await knex(tableNameContacts)
    .update('location', 107)
    .where('location', 'ilike', `%concepcion%`)

  await knex(tableNameContacts)
    .update('location', 163)
    .where('location', 'ilike', `%ENCARNACION%`)

  await knex(tableNameContacts)
    .update('location', 22)
    .where('location', 'ilike', `%SAN CRISTOBAL%`)

  await knex(tableNameContacts)
    .update('location', 1)
    .where('location', 'ilike', `%ASUNCION%`)

  await knex(tableNameContacts)
    .update('location', null)
    .where('location', '=', ``)

  await knex.schema.alterTable(tableNameContacts, function(t) {
    t.renameColumn('location', 'idLocation')
  })

  await knex.schema.raw(`DROP VIEW "viewListContacts"`)

  await knex.schema.alterTable(tableNameContacts, function(t) {
    t.integer('idLocation')
      .nullable()
      .alter()

    t.foreign('idLocation')
      .references('id')
      .inTable('cities')
  })

  return knex.schema.raw(`CREATE OR REPLACE VIEW "viewListContacts" AS ?`, [
    knex
      .select(
        'contacts.name',
        'contacts.owner',
        'contacts.phone',
        'contacts.idStatus',
        'contacts.idLanguage',
        'contacts.gender',
        'contacts.typeCompany',
        'contacts.idLocation',
        'contacts.email',
        'contacts.note',
        'languages.name as languageName',
        'status.description as statusDescription',
        'dc.createdAtDetailsContacts',
        knex.raw(
          'COALESCE(dc."lastConversationInDays",99999999999) as "lastConversationInDays"'
        ),
        'dc.publisherName'
      )
      .from('contacts')
      .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
      .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
      .joinRaw(
        `LEFT JOIN lateral (
        SELECT 
          "phoneContact", 
          "publishers"."name" as "publisherName", 
          "detailsContacts"."createdAt" as "createdAtDetailsContacts", 
          DATE_PART('day', now() - "detailsContacts"."createdAt") as "lastConversationInDays"
        FROM "detailsContacts"
        LEFT JOIN publishers on publishers.id = "detailsContacts"."idPublisher"
        WHERE "detailsContacts"."phoneContact" = contacts.phone
        ORDER BY "detailsContacts"."createdAt" DESC
        LIMIT 1) as dc ON contacts.phone = dc."phoneContact"`
      )
      .orderBy('contacts.phone')
  ])
}

exports.down = async function(knex) {
  await knex.schema.raw(`DROP VIEW "viewListContacts"`)

  await knex.schema.alterTable(tableNameContacts, function(t) {
    t.dropForeign('idLocation').renameColumn('idLocation', 'location')
  })

  await knex.schema.alterTable(tableNameContacts, function(t) {
    t.string('location')
      .nullable()
      .alter()
  })

  await knex.schema.raw(`CREATE OR REPLACE VIEW "viewListContacts" AS ?`, [
    knex
      .select(
        'contacts.name',
        'contacts.owner',
        'contacts.phone',
        'contacts.idStatus',
        'contacts.idLanguage',
        'contacts.gender',
        'contacts.typeCompany',
        'contacts.location',
        'contacts.email',
        'contacts.note',
        'languages.name as languageName',
        'status.description as statusDescription',
        'dc.createdAtDetailsContacts',
        knex.raw(
          'COALESCE(dc."lastConversationInDays",99999999999) as "lastConversationInDays"'
        ),
        'dc.publisherName'
      )
      .from('contacts')
      .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
      .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
      .joinRaw(
        `LEFT JOIN lateral (
        SELECT 
          "phoneContact", 
          "publishers"."name" as "publisherName", 
          "detailsContacts"."createdAt" as "createdAtDetailsContacts", 
          DATE_PART('day', now() - "detailsContacts"."createdAt") as "lastConversationInDays"
        FROM "detailsContacts"
        LEFT JOIN publishers on publishers.id = "detailsContacts"."idPublisher"
        WHERE "detailsContacts"."phoneContact" = contacts.phone
        ORDER BY "detailsContacts"."createdAt" DESC
        LIMIT 1) as dc ON contacts.phone = dc."phoneContact"`
      )
      .orderBy('contacts.phone')
  ])

  return knex.schema.dropTable(tableNameCities).dropTable(tableNameDpts)
}
