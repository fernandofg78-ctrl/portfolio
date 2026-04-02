// src/components/modal/PhoneMockup.jsx
// Mockup de móvil con iframe de la app real

export const PhoneMockup = ({ url, title }) => {
  return (
    <div className="phone-device">
      <div className="phone-device-inner">
        <div className="phone-camera" />
        <div className="phone-screen">
          <iframe
            src={url}
            title={title}
            className="phone-iframe"
            allow="fullscreen"
          />
        </div>
        <div className="phone-home-btn" />
      </div>
    </div>
  );
};
