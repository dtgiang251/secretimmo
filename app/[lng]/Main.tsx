// app/[lng]/Main.tsx

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';
import siteMetadata from "@/data/siteMetadata";
import Image from 'next/image';
import { Link as ScrollLink, Element } from 'react-scroll'

interface MainProps {
  posts: any[]; // Định nghĩa kiểu dữ liệu chính xác cho posts
  params: {
    lng: string;
  };
}

export default function Main({ posts, params }: MainProps) {
  const { t } = useTranslation('translation');
  const [advantages, setAdvantages] = useState([]);

  useEffect(() => {
    const advantageData = t('advantages', { returnObjects: true });
    setAdvantages(advantageData);
  }, [t]);

  const [formData, setFormData] = useState({
    locality: '',
    propertyType: '',
    surfaceArea: '',
    rooms: 1,
    garages: '',
    parkings: '',
    garden: '',
    terrace: '',
    equipment: '',
    terms: false
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

   // Xử lý khi người dùng nhập vào input locality
   const handleInputChange = async (e) => {
      const { value } = e.target;
      setFormData({
        ...formData,
        locality: value,
      });

      if (value) {
        setLoading(true);
        try {
          // Sử dụng route API nội bộ
          const response = await axios.get(`/api/locations`, {
            params: { q: value },
          });
          
          // Giả sử API trả về cấu trúc tương tự
          setCities(response.data.match.cities);  
        } catch (error) {
          console.error('Error fetching cities:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setCities([]);  // Clear results when input is empty
      }
  };


  // Xử lý khi người dùng chọn thành phố từ danh sách
  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      locality: city.city_name, // Cập nhật ô input với tên thành phố đã chọn
    });
    setCities([]); // Clear cities list after selection
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const propertyTypes = t('form.propertyTypes', { returnObjects: true });

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedType, setSelectedType] = useState('');

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleCategory = (category, event) => {
    event.stopPropagation(); // Ngăn sự kiện lan đến phần tử cha
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  // Đơn giản hóa hàm handleTypeSelect để chỉ chọn type mới
  const handleTypeSelect = (type, event) => {
    if (event) {
      event.stopPropagation(); // Ngăn sự kiện lan đến phần tử cha
    }
    
    // Luôn đặt type mới
    setSelectedType(type);
    
    // Cập nhật formData
    setFormData(prev => ({
      ...prev,
      propertyType: type
    }));
    
    // Tùy chọn: đóng dropdown sau khi chọn
    // setDropdownVisible(false);
  };


    // Thêm state để quản lý current step
  const [currentStep, setCurrentStep] = useState(1);
  
  interface ZoneConditions {
    codes: number[];
    apartment: {
      minSurface: number;
      minTerrace: number;
      minBedrooms: number;
    };
    house: {
      minSurface: number;
      minGarden: number;
    };
  }
  

  const zoneConditions: { [key: string]: ZoneConditions } = {
    zone1: {
      codes: [317, 333, 332, 330, 322, 327, 320],
      apartment: {
        minSurface: 95,  // with 5% tolerance
        minTerrace: 15,
        minBedrooms: 3
      },
      house: {
        minSurface: 142.5,  // with tolerance
        minGarden: 100
      }
    },
    zone2: {
      codes: [360, 359, 136],
      apartment: {
        minSurface: 142.5,
        minTerrace: 25,
        minBedrooms: 3
      },
      house: {
        minSurface: 190,
        minGarden: 300
      }
    },
    zone3: {
      codes: [342, 347, 310, 356, 138, 200],
      apartment: {
        minSurface: 142.5,
        minTerrace: 25,
        minBedrooms: 3
      },
      house: {
        minSurface: 237.5,
        minGarden: 500
      }
    },
    zone4: {
      codes: [],  // Mặc định cho các mã khác
      apartment: {
        minSurface: 332.5,
        minTerrace: 50,
        minBedrooms: 3
      },
      house: {
        minSurface: 332.5,
        minGarden: 1000
      }
    }
  };

  function determinePropertyType(
    propertyType: string, 
    propertyTypesMap: any
  ): 'house' | 'apartment' {
    console.log('Input propertyType:', propertyType);
    console.log('Input propertyTypesMap:', propertyTypesMap);
  
    // Nếu propertyTypesMap không hợp lệ, trả về mặc định
    if (!propertyTypesMap || typeof propertyTypesMap !== 'object') {
      console.warn('Invalid propertyTypesMap');
      return 'apartment';
    }
  
    // Chuyển đổi propertyType về dạng không dấu và viết thường để so sánh
    const normalizedPropertyType = propertyType
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  
    // Danh sách các từ khóa cho house
    const houseKeys = ['maison', 'house', 'haus'];
    
    // Nếu propertyTypesMap là mảng, chuyển thành đối tượng
    const processedPropertyTypesMap = Array.isArray(propertyTypesMap) 
      ? propertyTypesMap[0] || {} 
      : propertyTypesMap;
  
    // Duyệt qua các key (House/Apartment)
    for (const [type, typeList] of Object.entries(processedPropertyTypesMap)) {
      // Kiểm tra xem typeList có phải là mảng không
      if (!Array.isArray(typeList)) {
        console.warn(`Invalid typeList for type: ${type}`, typeList);
        continue;
      }
  
      // Chuyển đổi key về dạng không dấu và viết thường
      const normalizedType = type
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
  
      // Kiểm tra xem propertyType có nằm trong danh sách của key không
      const matchedTypeList = typeList.map(t => 
        String(t)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
      );
  
      console.log('Checking type:', type);
      console.log('Normalized Type:', normalizedType);
      console.log('Matched Type List:', matchedTypeList);
      console.log('Normalized Property Type:', normalizedPropertyType);
  
      // Nếu propertyType khớp với key hoặc nằm trong danh sách
      if (
        normalizedPropertyType === normalizedType || 
        matchedTypeList.includes(normalizedPropertyType)
      ) {
        // Trả về house nếu key hoặc normalizedType nằm trong danh sách house keys
        return houseKeys.includes(normalizedType) 
          ? 'house' 
          : 'apartment';
      }
    }
  
    // Mặc định trả về apartment nếu không xác định được
    return 'apartment';
  }
  
  
    
  
  function checkSecretImmoEligibility(
    cityCode: number, 
    propertyType: 'apartment' | 'house', 
    formData: {
      surfaceArea: string;
      terrace?: string;
      bedrooms?: string;
      garden?: string;
    }
  ): boolean {
    // Chuyển đổi dữ liệu sang số
    const surfaceArea = parseFloat(formData.surfaceArea);
    const terrace = parseFloat(formData.terrace || '0');
    const bedrooms = parseInt(formData.bedrooms || '0');
    const garden = parseFloat(formData.garden || '0');
  
    // Tìm zone phù hợp
    let matchedZone: ZoneConditions | undefined;
    
    for (const [zoneName, zoneData] of Object.entries(zoneConditions)) {
      if (zoneData.codes.includes(cityCode)) {
        matchedZone = zoneData;
        break;
      }
    }
  
    // Nếu không tìm thấy zone, sử dụng zone4 (other regions)
    if (!matchedZone) {
      matchedZone = zoneConditions.zone4;
    }

    // Object để lưu trạng thái điều kiện
    const conditionStatus = {
      cityCode: cityCode !== 0,
      surfaceArea: false,
      terrace: propertyType === 'house',
      bedrooms: propertyType === 'house',
      garden: propertyType === 'apartment'
    };
  
    // Log thông tin chi tiết để kiểm tra
    console.log('Checking Secret Immo Eligibility:', {
      cityCode,
      propertyType,
      formData,
      matchedZone
    });

    console.log(`Zone: ${matchedZone.codes}`);
  
    // Kiểm tra điều kiện cho từng loại bất động sản
    if (propertyType === 'apartment') {
      // Kiểm tra diện tích
      conditionStatus.surfaceArea = surfaceArea >= matchedZone.apartment.minSurface;
      console.log(`Surface Area: ${surfaceArea} >= ${matchedZone.apartment.minSurface} is ${conditionStatus.surfaceArea}`);

      // Kiểm tra sân hiên
      conditionStatus.terrace = terrace >= matchedZone.apartment.minTerrace;
      console.log(`Terrace: ${terrace} >= ${matchedZone.apartment.minTerrace} is ${conditionStatus.terrace}`);

      // Kiểm tra số phòng ngủ
      conditionStatus.bedrooms = bedrooms >= matchedZone.apartment.minBedrooms;
      console.log(`Bedrooms: ${bedrooms} >= ${matchedZone.apartment.minBedrooms} is ${conditionStatus.bedrooms}`);

      // Log trạng thái chi tiết
      console.log('Apartment Condition Status:', conditionStatus);

      // Kiểm tra tất cả điều kiện
      return Object.values(conditionStatus).every(condition => condition === true);

    } else if (propertyType === 'house') {
      // Kiểm tra diện tích
      conditionStatus.surfaceArea = surfaceArea >= matchedZone.house.minSurface;
      console.log(`Surface Area: ${surfaceArea} >= ${matchedZone.house.minSurface} is ${conditionStatus.surfaceArea}`);

      // Kiểm tra sân vườn
      conditionStatus.garden = garden >= matchedZone.house.minGarden;
      console.log(`Garden: ${garden} >= ${matchedZone.house.minGarden} is ${conditionStatus.garden}`);

      // Log trạng thái chi tiết
      console.log('House Condition Status:', conditionStatus);

      // Kiểm tra tất cả điều kiện
      return Object.values(conditionStatus).every(condition => condition === true);
    }
  
    return false;
  }

  

  const handleNextStep = async (e) => {
    e.preventDefault();
    
    // Kiểm tra property type
    if (!selectedType) {
      const tempElement = document.createElement('div');
      tempElement.setCustomValidity(t('form.type_error'));
      tempElement.reportValidity();
      return;
    }
  
    const form = e.target.closest('form');
    
    // Chọn các trường required và non-required ở step 1
    const step1RequiredFields = form.querySelectorAll('.step1 [required]');
    const step1NonRequiredFields = form.querySelectorAll('.step1 input:not([required])');
    
    // Kiểm tra tính hợp lệ của các trường required
    const areStep1RequiredFieldsValid = Array.from(step1RequiredFields).every(field => {
      field.setCustomValidity('');
      return field.validity.valid;
    });
  
    // Kiểm tra tính hợp lệ của các trường non-required
    const areStep1NonRequiredFieldsValid = Array.from(step1NonRequiredFields).every(field => {
      // Reset custom validity
      field.setCustomValidity('');
  
      // Nếu là input number và có giá trị
      if (field.type === 'number' && field.value.trim() !== '') {
        const value = Number(field.value);
        
        // Kiểm tra min
        if (field.min && value < Number(field.min)) {
          field.setCustomValidity(t('form.min_error', { min: field.min }));
          return false;
        }
        
        // Kiểm tra max
        if (field.max && value > Number(field.max)) {
          field.setCustomValidity(t('form.max_error', { max: field.max }));
          return false;
        }
      }
  
      return field.validity.valid;
    });
  
    // Kiểm tra điều khoản
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (!formData.terms) {
      termsCheckbox.setCustomValidity(t('form.terms_error'));
      termsCheckbox.reportValidity();
      return;
    } else {
      termsCheckbox.setCustomValidity('');
    }
  
    // Kiểm tra tất cả các trường
    const areAllFieldsValid = areStep1RequiredFieldsValid && areStep1NonRequiredFieldsValid;
  
    if (areAllFieldsValid) {
      try {
        const propertyTypes = t('form.propertyTypes', { returnObjects: true });
        const propertyTypeForCheck = determinePropertyType(selectedType, propertyTypes);
  
        // Fetch city data to get city code
        const cityResponse = await axios.get(`/api/locations`, {
          params: { q: formData.locality },
        });
        
        // Lấy city code từ response
        const cityCode = cityResponse.data.match.cities[0]?.id;
  
        // Kiểm tra điều kiện SecretImmo
        const isSecretImmo = checkSecretImmoEligibility(
          cityCode, 
          propertyTypeForCheck,
          {
            surfaceArea: formData.surfaceArea,
            terrace: formData.terrace,
            bedrooms: formData.rooms.toString(),
            garden: formData.garden
          }
        );
  
        // Hiển thị section phù hợp
        if (isSecretImmo) {
          document.querySelectorAll('.secretimmo').forEach(el => {
            el.style.display = 'block';
          });
          document.querySelectorAll('.nextimmo').forEach(el => {
            el.style.display = 'none';
          });
        } else {
          document.querySelectorAll('.secretimmo').forEach(el => {
            el.style.display = 'none';
          });
          document.querySelectorAll('.nextimmo').forEach(el => {
            el.style.display = 'block';
          });
        }
  
        // Chuyển sang step 2
        setCurrentStep(2);
      } catch (error) {
        console.error('Error fetching city data:', error);
        alert(t('form.city_fetch_error'));
      }
    } else {
      // Tìm và hiển thị validation cho trường đầu tiên không hợp lệ
      const firstInvalidRequiredField = Array.from(step1RequiredFields).find(field => !field.validity.valid);
      const firstInvalidNonRequiredField = Array.from(step1NonRequiredFields).find(field => !field.validity.valid);
      
      if (firstInvalidRequiredField) {
        firstInvalidRequiredField.reportValidity();
      } else if (firstInvalidNonRequiredField) {
        firstInvalidNonRequiredField.reportValidity();
      }
    }
  };
  
  
  // Thêm state để quản lý thông tin step 2
  const [step2Data, setStep2Data] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  });
  
  // Hàm xử lý thay đổi dữ liệu ở step 2
  const handleStep2Change = (e) => {
    const { name, value } = e.target;
    
    // Thêm validation cho từng trường
    switch(name) {
      case 'first_name':
      case 'last_name':
        // Chỉ cho phép chữ cái và khoảng trắng
        const nameRegex = /^[A-Za-zÀ-ỹ\s]*$/;
        if (nameRegex.test(value)) {
          setStep2Data(prev => ({
            ...prev,
            [name]: value
          }));
        }
        break;
      
      case 'phone':
        // Chỉ cho phép số và ký tự '+' ở đầu
        const phoneRegex = /^[+]?[0-9]*$/;
        if (phoneRegex.test(value)) {
          setStep2Data(prev => ({
            ...prev,
            [name]: value
          }));
        }
        break;
      
      case 'email':
        // Không giới hạn email
        setStep2Data(prev => ({
          ...prev,
          [name]: value
        }));
        break;
      
      default:
        setStep2Data(prev => ({
          ...prev,
          [name]: value
        }));
    }
  };
  
  // Hàm submit form cuối cùng
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
  
    // Validation chi tiết cho từng trường (giữ nguyên như cũ)
    const validations = {
      first_name: /^[A-Za-zÀ-ỹ\s]{2,50}$/,
      last_name: /^[A-Za-zÀ-ỹ\s]{2,50}$/,
      phone: /^[+]?[0-9]{8,15}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };
  
    let isValid = true;
    const errors = {};
  
    Object.keys(validations).forEach(field => {
      const value = step2Data[field];
      if (!validations[field].test(value)) {
        isValid = false;
        errors[field] = `Invalid ${field}`;
        
        const fieldElement = document.querySelector(`[name="${field}"]`);
        if (fieldElement) {
          fieldElement.setCustomValidity(t(`form.${field}_error`));
          fieldElement.reportValidity();
        }
      }
    });
  
    if (!isValid) {
      return;
    }
  
    // Kết hợp dữ liệu từ cả 2 form
    const finalFormData = {
      ...formData,
      ...step2Data,
      emailType: document.querySelector('.secretimmo:visible') ? 'secretimmo' : 'nextimmo'
    };
  
    try {
      const response = await fetch('/api/send-property-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });
  
      if (response.ok) {
        alert(t('form.submit_success'));
        resetForm();
      } else {
        alert(t('form.submit_error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t('form.submit_error'));
    }
  };
  
  
  // Hàm reset form
  const resetForm = () => {
    setFormData({
      locality: '',
      propertyType: '',
      surfaceArea: '',
      rooms: 1,
      garages: '',
      parkings: '',
      garden: '',
      terrace: '',
      equipment: '',
      terms: false
    });
    setStep2Data({
      first_name: '',
      last_name: '',
      phone: '',
      email: ''
    });
    setCurrentStep(1);
    setSelectedType('');
  };

  return (
    <>
      <div className="banner relative bg-[url('/static/banner.jpg')] h-[462px] md:h-[754px] lg:h-[772px] bg-cover bg-center">
        <div className="container flex items-center h-full relative z-10 mx-auto pt-5 pb-5">
          <div className="max-w-[760px] relative z-50 mx-auto flex flex-col justify-between items-center gap-10 text-center">
            <h1 className="leading-none text-white font-bold">
              {t('banner_title')}
            </h1>
            <ScrollLink to="section-form" smooth={true} duration={500} className="scroll-link bg-white flex gap-5 items-center block px-7 sm:px-10 py-5 text-base leading-6 rounded-full font-semibold cursor-pointer">
              {t('banner_button')}
              <Image src={`static/icons/down.svg`} alt={'down'} width={20} height={20} />
            </ScrollLink>
          </div>

          <Image className="absolute bottom-0 right-[20px] w-[281px] h-[423px] md:w-[390px] md:h-[587px]" src="/static/banner-people.png" alt={'people'} width={390} height={587} />

          <div className="flex flex-row items-center justify-between p-[24px] px-6 sm:px-[34px] gap-6 sm:gap-[40px] absolute w-auto md:w-[536px] -bottom-1/4 sm:-bottom-9 right-5 md:right-auto left-5 md:left-1/2 md:transform md:-translate-x-1/2 bg-white bg-opacity-90 shadow-[0px_40px_40px_rgba(0,_0,_0,_0.08)] backdrop-blur-[50px] rounded-[7px]">
            <Image src="/static/icons/call.svg" alt={'call'} width={32} height={32} className="min-w-8" />
            <div className="flex flex-col gap-2.5">
              <h3 className="font-bold text-[22px] leading-6.5 text-[#02073E]">{t('banner_support_title')}</h3>
              <div className="text-[#343D48] leading-5.5">{t('banner_support_desc')} <a className="text-black font-bold" href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a></div>
            </div>
            <a href={`mailto:${siteMetadata.email}`}><Image src="/static/icons/arrow-right.svg" alt={'right'} width={22} height={16}  className="min-w-5.5" /></a>
          </div>
        </div>
      </div>

    <div className="form-wrap relative">
      <div className="container mx-auto pt-35 sm:pt-25 pb-25">
        <form 
          onSubmit={currentStep === 1 ? handleNextStep : handleFinalSubmit} 
          noValidate 
          className="property-form"
        >
        <div className={`form-step step1 border-1 border-gray-100 max-w-[1200px] rounded-[24px] bg-white relative z-10 pt-10 px-5 sm:px-10 mx-auto ${currentStep === 1 ? 'block' : 'hidden'}`}>
            <div className="form-top-head text-center">
              <h2 className="text-3xl text-black inline-flex flex-col sm:flex-row items-center gap-5 justify-center font-bold mb-5">
                <Image src={`static/icons/logo-icon.svg`} alt={'logo'} width={40} height={40} />
                {t('form.title')}
              </h2>
              <div
                className="text-black"
                dangerouslySetInnerHTML={{
                  __html: t('form.desc'),
                }}
              />
            </div>
            <Element name="section-form" className="section-form">
            <div className="step-content mx-auto mt-12 pt-12 pb-15 border-t border-gray-200">
              <h3 className="form-sub-title">{t('form.criteria_title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7.5 mb-12">
                <div className="item relative">
                  <label>{t('form.locality_label')}</label>
                  <input
                    className="capitalize"
                    type="text"
                    required="required"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder={t('form.locality_placeholder')}
                  />
                  {cities.length > 0 && (
                    <ul className="cities-list">
                      {cities.map((city) => (
                        <li
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className="city-item"
                        >
                          {city.city_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="item">
        <label>{t('form.type_label')}</label>
        <div className="relative">
          <button
            type="button"
            className="w-full p-3 bg-white border-1 border-gray-100 px-3 py-4 text-black leading-5.5 w-full rounded-[4px] flex justify-between items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            {selectedType || t('form.select_type')}
            <span className="ml-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
          </button>

          {dropdownVisible && (
            <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-md z-10 max-h-64 overflow-y-auto">
              {Object.keys(propertyTypes).map((category) => (
                <div key={category} className="border-b last:border-b-0">
                  <div
                    className="px-4 py-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center font-medium"
                    onClick={(e) => toggleCategory(category, e)}
                  >
                    <span>{category}</span>
                    <span>
                      {expandedCategories[category] ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      )}
                    </span>
                  </div>

                  {expandedCategories[category] && (
                    <div className="bg-gray-50">
                      {propertyTypes[category].map((type) => {
                        const isSelected = selectedType === type;
                        return (
                          <div 
                            key={type}
                            className={`pl-4 pr-4 py-2 hover:bg-gray-200 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
                            onClick={(e) => handleTypeSelect(type, e)}
                          >
                            <div className="flex items-center w-full">
                              <input
                                type="checkbox"
                                className="mr-2 h-4 w-4"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation(); // Ngăn lan sự kiện
                                  handleTypeSelect(type, e);
                                }}
                                onClick={(e) => e.stopPropagation()} // Ngăn lan sự kiện nhưng vẫn giữ chức năng click của checkbox
                              />
                              <span className="flex-grow">{type}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

                <div className="item">
                  <label>{t('form.surface_label')}</label>
                  <span className="m2"><input
                    type="number"
                    required
                    min={100}
                    max={2000}
                    name="surfaceArea"
                    value={formData.surfaceArea}
                    onChange={handleChange}
                    placeholder=""
                  /></span>
                </div>

                <div className="item">
                  <label>{t('form.rooms_label')}</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={15}
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <h3 className="form-sub-title">{t('form.exterior_title')}</h3>
              <div className="grid rid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7.5  mb-12">
                <div className="item">
                  <label>{t('form.garages_label')}</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    name="garages"
                    value={formData.garages}
                    onChange={handleChange}
                  />
                </div>

                <div className="item">
                  <label>{t('form.parkings_label')}</label>
                  <select name="parkings" value={formData.parkings} onChange={handleChange}>
                    {Array.from({ length: 15 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="item">
                  <label>{t('form.garden_label')}</label>
                  <span className="m2"><input
                    type="number"
                    min={100}
                    max={2000}
                    name="garden"
                    value={formData.garden}
                    onChange={handleChange}
                  /></span>
                </div>

                <div className="item">
                  <label>{t('form.terrace_label')}</label>
                  <span className="m2"><input
                    type="number"
                    min={10}
                    max={500}
                    name="terrace"
                    value={formData.terrace}
                    onChange={handleChange}
                  /></span>
                </div>
              </div>

              <h3 className="form-sub-title">{t('form.equipment_title')}</h3>
              <div className="form-radios flex flex-row flex-wrap gap-10 justify-center">
                <label>
                  <input
                    type="radio"
                    name="equipment"
                    value="piscine"
                    checked={formData.equipment === 'piscine'}
                    onChange={handleChange}
                  />
                  <span>{t('form.piscine_label')}</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="equipment"
                    value="sportsArea"
                    checked={formData.equipment === 'sportsArea'}
                    onChange={handleChange}
                  />
                  <span>{t('form.sports_area_label')}</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="equipment"
                    value="smartHome"
                    checked={formData.equipment === 'smartHome'}
                    onChange={handleChange}
                  />
                  <span>{t('form.smart_home_label')}</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="equipment"
                    value="alarm"
                    checked={formData.equipment === 'alarm'}
                    onChange={handleChange}
                  />
                  <span>{t('form.alarm_label')}</span>
                </label>
              </div>

              <div className="text-center mt-12">
                <a  onClick={handleNextStep} className="next-step bg-black text-[16px] font-semibold inline-flex px-10 py-5 text-white rounded-[50px] mx-auto cursor-pointer">{t('form.submit_button')}</a>

                <div className="checkbox mt-5">
                  <label>
                    <input
                      type="checkbox"
                      required
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                    />
                    <span>{t('form.terms_label')}</span>
                  </label>
                </div>
              </div>
            </div>
            </Element>
          </div>

          <div className={`form-step step2 border-1 border-gray-100 max-w-[1200px] rounded-[24px] bg-white relative z-10 pt-10 mx-auto ${currentStep === 2 ? 'block' : 'hidden'}`}>
            <div className="form-top-head mx-auto text-center secretimmo">
              <h2 className="text-3xl text-black inline-flex items-center gap-5 justify-center font-bold mb-5">
                {t('form.secretimmo_title')}
              </h2>
              <div
                className="text-black"
                dangerouslySetInnerHTML={{
                  __html: t('form.secretimmo_desc'),
                }}
              />
            </div>

            <div className="form-top-head mx-auto text-center nextimmo">
              <h3 className="text-[22px] text-gray-400 inline-flex items-center gap-5 justify-center font-bold mb-5">
                {t('form.nextimmo_subtitle')}
              </h3>
              <h2 className="text-3xl text-black inline-flex items-center gap-5 justify-center font-bold mb-5">
                {t('form.nextimmo_title')}
              </h2>
              <div
                className="text-black"
                dangerouslySetInnerHTML={{
                  __html: t('form.nextimmo_desc'),
                }}
              />
            </div>

            <div className="step-content max-w-[1120px] mx-auto mt-12 pt-12 pb-15 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-7.5 mb-12">
                <div className="item">
                  <label>{t('form.first_name_label')}</label>
                  <input
                    type="text"
                    required
                    name="first_name"
                    value={step2Data.first_name}
                    onChange={handleStep2Change}
                    placeholder=""
                  />
                </div>

                <div className="item">
                  <label>{t('form.last_name_label')}</label>
                  <input
                    type="text"
                    required="required"
                    name="last_name"
                    value={step2Data.last_name}
                    onChange={handleStep2Change}
                    placeholder=""
                  />
                </div>

                <div className="item">
                  <label>{t('form.phone_label')}</label>
                  <input
                    type="text"
                    required="required"
                    name="phone"
                    value={step2Data.phone}
                    onChange={handleStep2Change}
                    placeholder=""
                  />
                </div>

                <div className="item">
                  <label>{t('form.email_label')}</label>
                  <input
                    type="email"
                    required="required"
                    name="email"
                    value={step2Data.email}
                    onChange={handleStep2Change}
                    placeholder=""
                  />
                </div>
              </div>

              <div className="text-center mt-12 secretimmo">
                <button type="submit" className="form-submit bg-black text-[16px] font-semibold inline-flex px-10 py-5 text-white rounded-[50px] mx-auto cursor-pointer">
                  {t('form.secretimmo_button')}
                </button>
              </div>
              <div className="text-center mt-12 nextimmo">
                <button type="submit" className="form-submit bg-[#B91C1C] text-[16px] font-semibold inline-flex px-10 py-5 text-white rounded-[50px] mx-auto cursor-pointer">
                  {t('form.nextimmo_button')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

      <div className="advantages bg-black secretimmo">
        <div className="container mx-auto pt-20 pb-30">
          <h2 className="max-w-[850px] mx-auto text-center text-white text-3xl font-bold mb-22">
            {t('advantages_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10 md:gap-y-20 text-center md:text-left">
            {advantages.map((advantage, index) => (
              <div key={index} className="advantage-item">
                <h4 className="text-sm text-green mb-3">{advantage.title}</h4>
                <div className="text-white">{advantage.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
