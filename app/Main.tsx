"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';
import siteMetadata from "@/data/siteMetadata";
import Image from 'next/image';
import { Link as ScrollLink, Element } from 'react-scroll';

export default function Home() {
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
        const response = await axios.get(`https://nextimmo.lu/api/v2/aggregate/cities`, {
          params: { action: 'allCities', q: value },
        });
        setCities(response.data.match.cities);  // Lấy dữ liệu cities từ response
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

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('your_service_id', 'your_template_id', formData, 'your_user_id')
      .then((response) => {
        console.log('Email sent successfully', response);
        alert('Email sent successfully!');
      })
      .catch((error) => {
        console.log('Error sending email', error);
        alert('Failed to send email. Please try again.');
      });
  };

  return (
    <>
      <div className="banner relative bg-[url('/static/banner.jpg')] h-[772px] bg-cover bg-center">
        <div className="container flex items-center h-full relative z-10 mx-auto pt-5 pb-5">
          <div className="max-w-[760px] mx-auto flex flex-col justify-between items-center gap-10 text-center">
            <h1 className="leading-none text-white font-bold">
              {t('banner_title')}
            </h1>
            <ScrollLink to="section-form" smooth={true} duration={500} className="scroll-link bg-white flex gap-5 items-center block px-10 py-5 text-base leading-6 rounded-full font-semibold cursor-pointer">
              {t('banner_button')}
              <Image src={`static/icons/down.svg`} alt={'down'} width={20} height={20} />
            </ScrollLink>
          </div>

          <Image className="absolute bottom-0 right-[20px]" src="/static/banner-people.png" alt={'people'} width={390} height={587} />

          <div className="flex flex-row items-center p-[24px] px-[34px] gap-[40px] absolute w-[536px] -bottom-9 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 shadow-[0px_40px_40px_rgba(0,_0,_0,_0.08)] backdrop-blur-[50px] rounded-[7px]">
            <Image src="/static/icons/call.svg" alt={'call'} width={32} height={32} />
            <div className="flex flex-col gap-2.5">
              <h3 className="font-bold text-[22px] leading-6.5 text-[#02073E]">{t('banner_support_title')}</h3>
              <div className="text-[#343D48] leading-5.5">{t('banner_support_desc')} <a className="text-black font-bold" href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a></div>
            </div>
            <a href={`mailto:${siteMetadata.email}`}><Image src="/static/icons/arrow-right.svg" alt={'right'} width={22} height={16} /></a>
          </div>
        </div>
      </div>

    
      <div className="container mx-auto pt-25 pb-25">
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-step step1">
            <div className="form-top-head text-center">
              <h2 className="text-3xl text-black inline-flex items-center gap-5 justify-center font-bold mb-5">
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
            <div className="step-content max-w-[1120px] mx-auto mt-12 pt-12 pb-15 border-t border-gray-200">
              <h3 className="form-sub-title">{t('form.criteria_title')}</h3>
              <div className="grid grid-cols-4 gap-7.5 mb-12">
                <div className="item">
                  <label>{t('form.locality_label')}</label>
                  <input
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
                  <select required="required" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                    <option>{t('form.select_type')}</option>
                    
                  </select>
                </div>

                <div className="item">
                  <label>{t('form.surface_label')}</label>
                  <span className="m2"><input
                    type="number"
                    required="required"
                    min="100"
                    max="2000"
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
                    required="required"
                    min="1"
                    max="15"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <h3 className="form-sub-title">{t('form.exterior_title')}</h3>
              <div className="grid grid-cols-4 gap-7.5  mb-12">
                <div className="item">
                  <label>{t('form.garages_label')}</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
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
                    min="100"
                    max="2000"
                    name="garden"
                    value={formData.garden}
                    onChange={handleChange}
                  /></span>
                </div>

                <div className="item">
                  <label>{t('form.terrace_label')}</label>
                  <span className="m2"><input
                    type="number"
                    min="10"
                    max="500"
                    name="terrace"
                    value={formData.terrace}
                    onChange={handleChange}
                  /></span>
                </div>
              </div>

              <h3 className="form-sub-title">{t('form.equipment_title')}</h3>
              <div className="form-radios flex flex-row gap-10 justify-center">
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
                <a className="next-step bg-black text-[16px] font-semibold inline-flex px-10 py-5 text-white rounded-[50px] mx-auto cursor-pointer">{t('form.submit_button')}</a>

                <div className="checkbox mt-5">
                  <label>
                    <input
                      type="checkbox"
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

          <div className="form-step step2">
            <div className="form-top-head max-w-[1120px] mx-auto text-center secretimmo">
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

            <div className="form-top-head max-w-[1120px] mx-auto text-center nextimmo">
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
                    required="required"
                    name="first_name"
                    value=""
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>

                <div className="item">
                  <label>{t('form.last_name_label')}</label>
                  <input
                    type="text"
                    required="required"
                    name="last_name"
                    value=""
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>

                <div className="item">
                  <label>{t('form.phone_label')}</label>
                  <input
                    type="text"
                    required="required"
                    name="phone"
                    value=""
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>

                <div className="item">
                  <label>{t('form.email_label')}</label>
                  <input
                    type="text"
                    required="required"
                    name="email"
                    value=""
                    onChange={handleChange}
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

      <div className="advantages bg-black secretimmo">
        <div className="container mx-auto pt-20 pb-30">
          <h2 className="max-w-[850px] mx-auto text-center text-white text-3xl font-bold mb-22">
            {t('advantages_title')}
          </h2>
          <div className="grid grid-cols-3 gap-x-10 gap-y-20">
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
