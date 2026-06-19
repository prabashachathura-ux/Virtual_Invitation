// ==========================================
// WEDDING INVITATION CONFIGURATION
// Edit this file to customize the template for new clients
// ==========================================

const WeddingConfig = {
    // 1. Couple Details
    couple: {
        initialsSeal: "C&S",               
        initialsLetter: "C & S",           
        namesLetter: "Chathura & Samadhi", 
        namesMain: 'Chathura <span class="text-[#d4af37]">&</span> Samadhi', 
        namesFooter: 'Chathura <span class="text-[#1c211d] font-normal">&</span> Samadhi' 
    },

    // 2. Date & Time
    date: {
        countdownTarget: "August 23, 2026 17:30:00", // This acts as the official Start Time for the calendar!
        letterFormat: "23 · 08 · 2026",              
        displayCard: "Sunday<br>23 August 2026",     
        poruwaTime: "5:30 PM",                       
        receptionTime: "6:30 PM Onwards",            
        footerFormat: "Twenty Third of August · Twenty Twenty Six" 
    },

    // 3. Family Details
    families: {
        groomParents: "Mr. & Mrs. Ajith<br>Prasanna",
        brideParents: "Mr. & Mrs. Lalith<br>Midellawala"
    },

    // 4. Venue & Location
    venue: {
        nameShort: "The Lakeside<br>Gampaha", 
        nameFull: "The Lakeside",             
        address: "Gampaha, Sri Lanka",
        mapIframeSrc: "https://www.google.com/maps?q=The+Lakeside,+Gampaha,+Sri+Lanka&output=embed", 
        directionsLink: "https://maps.app.goo.gl/8rWkn1hvuygbRG7Y7", 
        // NOTE: Google and Outlook Calendar links are now auto-generated below!
    },

    // 5. RSVP System
    rsvp: {
        googleSheetScriptURL: "https://script.google.com/macros/s/AKfycbwMJ9GR0wUVTq2eWudGRYt4tTDkgtgUGqUDhr1Ye46WPEO_khkQLAnF4m2R_-xO0ElI/exec",
        groomContact: "+94 77 123 4567",
        groomContactLink: "tel:+94771234567",
        brideContact: "+94 77 765 4321",
        brideContactLink: "tel:+94777654321"
    },

    // 6. Visual Theme (Canvas Petals)
    theme: {
        petalColors: ['#C88A87', '#d69fa0', '#C5A365', '#f2dada']
    }
};

// ==========================================
// AUTOMATED LINK GENERATOR
// Do not edit below this line. This script automatically builds 
// the complex calendar URLs based on the data you entered above.
// ==========================================
(function generateCalendarLinks() {
    // 1. Safely encode the text so it works inside a URL (handles spaces, '&' symbols, etc.)
    const title = encodeURIComponent(`Wedding of ${WeddingConfig.couple.namesLetter}`);
    const location = encodeURIComponent(`${WeddingConfig.venue.nameFull}, ${WeddingConfig.venue.address}`);
    const details = encodeURIComponent(
        `Join us for our special day!\n\nPoruwa Ceremony: ${WeddingConfig.date.poruwaTime}\nReception: ${WeddingConfig.date.receptionTime}`
    );

    // 2. Calculate the exact dates
    const startDate = new Date(WeddingConfig.date.countdownTarget);
    // Assuming the wedding lasts about 6 hours for the calendar block
    const endDate = new Date(startDate.getTime() + (6 * 60 * 60 * 1000)); 

    // 3. Format the dates specific to Google and Outlook requirements
    // Google requires YYYYMMDDTHHMMSSZ format
    const formatGoogle = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');
    const gDates = `${formatGoogle(startDate)}/${formatGoogle(endDate)}`;
    
    // Outlook accepts standard ISO 8601 format natively
    const formatOutlook = (date) => date.toISOString();

    // 4. Attach the generated links back to the config object so the HTML can read them
    WeddingConfig.venue.googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gDates}&details=${details}&location=${location}`;
    
    WeddingConfig.venue.outlookCalendarLink = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${formatOutlook(startDate)}&enddt=${formatOutlook(endDate)}&subject=${title}&location=${location}&body=${details}`;
})();