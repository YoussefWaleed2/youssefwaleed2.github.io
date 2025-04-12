import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">
            LOREM IPSUM DOLOR SIT AMET, CONSECTETUER ADIPISCING
            ELIT, SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT UT
            LAOREET DOLORE MAGNA ALIQUAM ERAT VOLUTPAT. UT WISI
            ENIM AD MINIM VENIAM.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/services">Services</Link>
            <Link to="/join-us">join us</Link>
          </nav>
        </div>
      </div>

      <div className="footer-logo">
      
         
            <svg
              className="img-logo"
              width="92"
              height="32"
              viewBox="0 0 92 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_19_256)">
                <path d="M86.1351 23.1726C86.0751 23.4426 86.0001 23.6976 85.9401 23.9676C84.9651 27.6726 82.6101 30.0726 78.5901 30.6726C77.0001 30.9126 74.8701 30.8226 73.2351 30.8676C73.1001 30.8676 72.9801 30.8526 72.7851 30.8376C72.9051 30.6426 72.9801 30.5076 73.0851 30.3726C73.9251 29.1576 74.7801 27.9576 75.5901 26.7276C75.7251 26.5176 75.8301 26.2326 75.8301 25.9926C75.8301 19.4226 75.8301 12.8676 75.8301 6.2976C75.8301 6.0576 75.7251 5.7726 75.5901 5.5626C74.7651 4.3476 73.9101 3.1326 73.0701 1.9176C72.9801 1.7826 72.8901 1.6476 72.7401 1.3926H76.6401C76.6401 1.3926 76.6401 1.3176 76.6401 1.2876H62.8851C63.0651 1.3926 63.2601 1.4076 63.4401 1.4226C64.0551 1.4376 64.6701 1.4226 65.2701 1.4826C66.7101 1.6026 66.3201 2.3526 66.5601 3.7026C66.6651 4.2726 66.6951 4.8576 66.6951 5.4426C66.6951 12.5826 66.6951 19.7376 66.6951 26.8926C66.6951 27.2826 66.6951 27.6576 66.6651 28.0476C66.5151 29.7576 65.6451 30.6576 63.9501 30.8226C63.3651 30.8826 62.7651 30.8526 62.1651 30.8676H62.1051C61.9251 30.8676 61.7451 30.8826 61.5801 30.8976V31.0176C61.7301 31.0176 61.8651 31.0476 62.0001 31.0476C69.4701 31.0476 77.4201 31.0476 84.8751 31.0476C85.1301 31.0476 85.2801 31.0026 85.3551 30.8526C85.3851 30.7926 85.4151 30.7026 85.4301 30.5826C85.6701 28.3926 85.9551 26.2026 86.2101 24.0126C86.2401 23.7276 86.2401 23.4426 86.2551 23.1726C86.2101 23.1726 86.1651 23.1726 86.1201 23.1576M72.5151 30.8526H70.4901V1.4676H72.5151V30.8376V30.8526Z" fill="white" />
                <path d="M6.425 1.25757H0.875C0.875 1.25757 0.875 1.31757 0.875 1.36257C0.92 1.37757 0.98 1.42257 1.025 1.42257C2.18 1.51257 3.065 2.17257 3.665 3.20757C4.28 4.25757 4.835 5.36757 5.255 6.52257C8.135 14.4276 11.405 22.6476 14.255 30.5676L14.435 31.0776H17.675L15.575 24.7776C13.7 19.5126 9.395 8.90757 6.425 1.25757Z" fill="white" />
                <path d="M37.9997 1.07744L33.3497 1.01744H32.2997L30.7847 3.37244C27.1997 9.25244 23.5697 14.6374 19.5047 21.1924C17.1647 14.6974 15.4547 10.5874 13.0997 4.09244C12.8747 3.47744 12.7847 2.87744 13.0547 2.24744C13.3097 1.67744 13.7147 1.31744 14.2997 1.21244C14.5247 1.18244 14.7347 1.16744 14.9597 1.16744H15.2147L15.5897 1.00244H7.96973C9.25973 4.15244 10.5647 7.42244 10.7447 7.88744L18.9647 28.3024C19.4747 27.4474 20.0297 26.4874 20.6147 25.5424C25.5497 17.5024 30.8747 9.91244 35.0297 2.98244C35.5547 2.09744 36.2447 1.57244 37.1897 1.42244C37.3397 1.39244 37.4747 1.37744 37.6247 1.34744C37.7447 1.34744 37.8647 1.34744 37.9847 1.34744V1.07744H37.9997Z" fill="white" />
                <path d="M62.1501 17.2625C60.9651 16.5275 59.6601 16.0475 58.2801 15.7925C57.4851 15.6425 56.6751 15.5375 55.8651 15.4175C55.9401 15.3275 56.0151 15.2975 56.0901 15.2975C57.8451 14.9975 59.5101 14.4875 60.9651 13.4675C63.1701 11.9075 64.1301 9.83748 63.6201 7.24248C63.2001 5.09748 61.7451 3.68748 59.7801 2.71248C57.4701 1.58748 54.9801 1.19748 52.4301 1.19748C49.0551 1.19748 45.6951 1.19748 42.3201 1.19748L39.9951 1.16748V1.46748C40.3851 1.46748 40.7751 1.46748 41.1651 1.51248C42.5451 1.60248 43.6401 2.65248 43.8201 3.97248C43.8801 4.42248 43.9101 4.87248 43.9101 5.33748C43.9101 12.4775 43.9101 19.6175 43.9101 26.7575C43.9101 27.2375 43.8801 27.7175 43.8051 28.1975C43.6251 29.5325 42.8751 30.2975 41.4951 30.5075C40.8051 30.6125 41.6001 30.5825 40.8951 30.6125C40.8951 30.6125 40.8651 30.6125 40.8501 30.6125L40.8051 31.0325H40.8801C43.5501 31.0325 44.6901 31.0325 47.3601 31.0325C50.3151 31.0325 53.2701 30.8075 56.2251 30.6875C56.4951 30.6875 56.7501 30.6575 57.0201 30.6275C58.6401 30.4775 60.1851 30.0125 61.6101 29.2325C66.3351 26.6375 66.7251 20.1425 62.1501 17.2925M50.0151 1.46748C51.5451 1.51248 53.1051 1.42248 54.6051 1.63248C56.3901 1.88748 57.7701 2.90748 58.5651 4.46748C59.9601 7.22748 59.9601 10.0325 58.3251 12.7175C57.2151 14.5325 55.4151 15.3275 53.2551 15.3875C53.1651 15.3875 53.0901 15.3725 52.9401 15.3425V14.7575C52.9401 11.9525 52.9401 9.14748 52.9401 6.32748C52.9401 6.05748 52.8351 5.74248 52.6851 5.50248C51.7851 4.16748 50.8701 2.86248 49.9551 1.54248C50.0001 1.49748 50.0151 1.45248 50.0301 1.45248M49.6251 30.5375H47.6001V1.48248H49.6251V30.5375ZM59.9751 27.4925C59.0001 29.3075 57.3351 30.3425 55.2201 30.5075C53.4951 30.6425 51.7401 30.5375 49.8951 30.5375C50.8251 29.1875 51.7101 27.8975 52.6101 26.6375C52.8651 26.2775 52.9701 25.9175 52.9701 25.4825C52.9551 22.4075 52.9701 19.3325 52.9701 16.2575V15.6125C54.5451 15.5075 56.0601 15.5825 57.4851 16.2725C58.6701 16.8425 59.5701 17.7125 60.1251 18.8525C61.5201 21.7325 61.5351 24.6425 60.0051 27.4925" fill="white" />
                <path d="M36.395 9.65751C36.5 9.47751 36.59 9.14751 36.59 8.93751C36.605 7.39251 36.59 5.86251 36.59 4.31751C36.59 4.19751 36.56 4.09251 36.53 3.82251C36.365 4.07751 36.26 4.21251 36.17 4.36251C32.285 10.8275 25.205 21.2975 21.29 27.7325C20.72 28.6625 20.06 29.8475 19.355 31.0475H23.6L23.915 30.5225C23.915 30.5225 23.9 30.5225 23.885 30.5225C24.005 30.2975 24.11 30.1325 24.215 29.9525C28.265 23.1875 32.33 16.4375 36.38 9.67251" fill="white" />
                <path d="M34.2647 1.55755L32.5697 0.987549H25.8647L21.1847 1.00255H18.4697V8.95255H19.0997L19.5947 6.64255C19.9997 4.79755 20.7047 3.41755 22.3697 2.51755C24.3497 1.45255 27.1847 1.45255 29.3297 1.51255C30.1697 1.54255 31.0247 1.54255 31.8647 1.54255C32.5397 1.54255 33.6347 1.31755 34.2647 1.54255" fill="white" />
                <path d="M37.9853 26.5776C37.9853 26.5776 37.9253 26.6676 37.9103 26.7126C36.5903 28.7976 34.6703 29.8776 32.4053 30.2376V30.8676H38.0003V26.5776H37.9853Z" fill="white" />
                <path d="M31.1448 30.3577C30.4398 30.3877 29.7348 30.4027 29.0298 30.4027L28.7148 30.8527H32.4048V30.2227C31.9998 30.2827 31.5798 30.3277 31.1448 30.3427" fill="white" />
                <path d="M85.895 5.2776C85.895 3.7026 87.17 2.4126 88.745 2.4126C90.335 2.4126 91.61 3.6876 91.625 5.2626C91.625 6.8376 90.32 8.1576 88.73 8.1426C87.185 8.1426 85.895 6.8526 85.895 5.2776ZM88.76 7.7676C90.14 7.7676 91.25 6.6576 91.265 5.2776C91.265 3.8976 90.155 2.7876 88.775 2.7876C87.395 2.7876 86.285 3.8976 86.285 5.2776C86.285 6.6576 87.395 7.7676 88.775 7.7676" fill="white" />
                <path d="M88.2198 6.64258H87.6948V3.80758C87.6948 3.80758 87.7098 3.80758 87.7248 3.80758C88.2198 3.80758 88.7298 3.79258 89.2248 3.83758C90.0348 3.91258 90.2448 4.70758 89.9598 5.24758C89.8698 5.42758 89.7048 5.54758 89.5248 5.60758C89.4798 5.62258 89.4348 5.63758 89.3748 5.66758C89.6598 5.99758 89.9448 6.31258 90.2298 6.64258C90.2298 6.64258 90.2298 6.65758 90.2148 6.67258C90.0198 6.67258 89.8248 6.67258 89.6298 6.67258C89.5998 6.67258 89.5698 6.64258 89.5398 6.61258C89.2998 6.34258 89.0748 6.07258 88.8348 5.80258C88.8048 5.75758 88.7298 5.72758 88.6848 5.72758C88.5498 5.72758 88.4148 5.72758 88.2648 5.72758V6.67258L88.2198 6.64258ZM88.2198 4.31758C88.2198 4.60258 88.2198 4.88758 88.2198 5.15758C88.2198 5.17258 88.2648 5.21758 88.2798 5.21758C88.5648 5.21758 88.8648 5.21758 89.1498 5.20258C89.3748 5.18758 89.5098 4.99258 89.5248 4.76758C89.5248 4.54258 89.3898 4.33258 89.1648 4.31758C88.8498 4.30258 88.5498 4.31758 88.2198 4.31758Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_19_256">
                  <rect
                    width="90.75"
                    height="30.075"
                    fill="white"
                    transform="translate(0.875 0.987549)"
                  />
                </clipPath>
              </defs>
            </svg>
          
        
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 VZBL All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
