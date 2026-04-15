import { ArrowRight, User, Fingerprint } from "lucide-react";

const Step1Personal = ({ formData, errors, updateFormData, updateErrors, validateStep, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name]) updateErrors({ [name]: null });
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleBirthdateChange = (e) => {
    const birthdate = e.target.value;
    handleChange(e);
    if (birthdate) {
      const age = calculateAge(birthdate);
      let ageRange = age < 18 ? "under-18" : age <= 25 ? "18-25" : age <= 35 ? "26-35" : age <= 50 ? "36-50" : age <= 65 ? "51-65" : "65-plus";
      updateFormData({ ageRange });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
            placeholder="Enter first name"
          />
          {errors.firstname && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.firstname}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
            placeholder="Enter last name"
          />
          {errors.lastname && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.lastname}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Gender</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["male", "female", "non-binary", "other"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleChange({ target: { name: 'gender', value: option } })}
              className={`px-4 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
                formData.gender === option 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20' 
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Birthdate</label>
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleBirthdateChange}
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
        />
        {errors.birthdate && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.birthdate}</p>}
      </div>

      <div className="flex justify-end items-center space-x-6 pt-10">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Next: Contact Info</span>
         <button
            onClick={() => validateStep(1) && nextStep()}
            className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all"
         >
            <ArrowRight className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};

export default Step1Personal;