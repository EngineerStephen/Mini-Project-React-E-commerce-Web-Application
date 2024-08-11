import React from "react";
import NavigationBar from "./NavigationBar";
import "./App.css";



export function Home() {
    return (

        
            
    <div>
        <NavigationBar />
        <div className="header">
            <h1>Watch</h1>
        </div>
    
        <div className="container">
            <div class="image"></div>
            <div class="info">
                <h2>Timeless Elegance</h2>
                <p>The watch is a symbol of craftsmanship and elegance, blending classic design with modern precision.</p>
            </div>
        </div>
    
        <div className="features">
            <div className="feature">
                <h3>Precision Engineering</h3>
                <p>Our watches are designed with the highest standards of precision to ensure accurate timekeeping.</p>
            </div>
            <div class="feature">
                <h3>Luxury Design</h3>
                <p>Each watch is a masterpiece, crafted with premium materials and attention to every detail.</p>
            </div>
            <div class="feature">
                <h3>Durability</h3>
                <p>With water resistance and scratch-resistant glass, our watches are made to last.</p>
            </div>
        </div>
    
        <div className="footer">
            <p>&copy; 2024. All Rights Reserved.</p>
        </div>
    </div>
            
    );


}
export default Home;
