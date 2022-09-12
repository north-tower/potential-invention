import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import Search from "./Search" ;


function NavBar() {
    return( 
      <div>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            
            <div class="container-fluid">
              
                    
              <div class="collapse navbar-collapse justify-content-center"
                id="navbarCenteredExample"
              >
                
                <ul class="navbar-nav mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Tiempo Aplicación</a>
                  </li>
                </ul>
                
              </div>
              
            </div>
            
          </nav>
      </div>
    )}
  
export default NavBar;