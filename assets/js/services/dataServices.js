
const DataService = {
  KEYS: {
    MAHASISWA: "siakad_data_mahasiswa",
    DOSEN: "siakad_data_dosen",
    FAKULTAS: "siakad_data_fakultas",
    PRODI: "siakad_data_prodi",
    BIODATA_MAHASISWA: "siakad_biodata_mahasiswa",
    BIODATA_DOSEN: "siakad_biodata_dosen",
  },

  initialData: {
    mahasiswa: [
      {
        id: "1",
        nim: "2024567890",
        nama: "Mahasiswa Demo",
        prodi: "Teknik Informatika",
        semester: "4",
        status: "Aktif",
      },
      {
        id: "2",
        nim: "2024567891",
        nama: "Budi Santoso",
        prodi: "Sistem Informasi",
        semester: "2",
        status: "Aktif",
      },
    ],
    dosen: [
      {
        id: "1",
        nip: "198507122010121003",
        nama: "Dosen Pengajar",
        email: "dosen@siakad.ac.id",
        prodi: "Teknik Informatika",
        status: "Aktif",
      },
    ],
    biodataMahasiswa: {
      nim: "2024567890",
      nama: "Mahasiswa Demo",
      ttl: "Jakarta, 15 Mei 2004",
      gender: "Laki-laki",
      alamat: "Jl. Merdeka No. 45, Jakarta Selatan",
      email: "mahasiswa.demo@siakad.ac.id",
      telepon: "081234567890",
      prodi: "Teknik Informatika",
      semester: "4",
    },
    biodataDosen: {
      nip: "198507122010121003",
      nama: "Dosen Pengajar",
      email: "dosen@siakad.ac.id",
      telepon: "089876543210",
      alamat: "Jl. Kampus Universitas No. 12, Bandung",
      fakultas: "Fakultas Teknologi Informasi",
    },
  },

  init() {
    if (!Storage.get(this.KEYS.MAHASISWA))
      Storage.set(this.KEYS.MAHASISWA, this.initialData.mahasiswa);
    if (!Storage.get(this.KEYS.DOSEN))
      Storage.set(this.KEYS.DOSEN, this.initialData.dosen);
    if (!Storage.get(this.KEYS.BIODATA_MAHASISWA))
      Storage.set(
        this.KEYS.BIODATA_MAHASISWA,
        this.initialData.biodataMahasiswa,
      );
    if (!Storage.get(this.KEYS.BIODATA_DOSEN))
      Storage.set(this.KEYS.BIODATA_DOSEN, this.initialData.biodataDosen);
  },

  getAll(key) {
    return Storage.get(key) || [];
  },
  saveAll(key, data) {
    Storage.set(key, data);
  },

  getBiodata(role) {
    const key =
      role === "Mahasiswa"
        ? this.KEYS.BIODATA_MAHASISWA
        : this.KEYS.BIODATA_DOSEN;
    return (
      Storage.get(key) ||
      (role === "Mahasiswa"
        ? this.initialData.biodataMahasiswa
        : this.initialData.biodataDosen)
    );
  },

  saveBiodata(role, data) {
    const key =
      role === "Mahasiswa"
        ? this.KEYS.BIODATA_MAHASISWA
        : this.KEYS.BIODATA_DOSEN;
    Storage.set(key, data);
  },
};

DataService.init();
