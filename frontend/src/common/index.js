const backendDomain = process.env.REACT_APP_BACKEND_URL//"http://localhost:5000";

const SummaryApi = {
    signUP : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    },
   current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : "get"
    },
    allUser : {
        url : `${backendDomain}/api/all-user`,
        method : "get"
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : "post"
    },
    deleteUser : {
        url : `${backendDomain}/api/delete-user`,
        method : "post"
    },    
    uploadProduct : {
        url : `${backendDomain}/api/upload-product`,
        method : 'post'
    },
    
    allProduct : {
        url : `${backendDomain}/api/get-product`,
        method : 'get'
    },
    
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method : 'post'
    },
    marketRecord : {
        url : `${backendDomain}/api/market-record`,
        method : 'post'
    },
    userMarket : {
        url : `${backendDomain}/api/upload-market`,
        method : 'post'
    },
    myMarket : {
        url : `${backendDomain}/api/get-market`,
        method : 'get'
    },
    allUserMarkets : {
        url : `${backendDomain}/api/get-all-users-market`,
        method : 'get'
    },
    updateMarketStatus : {
        url : `${backendDomain}/api/update-market-status`,
        method : 'post'
    },
    createNotification : {
        url : `${backendDomain}/api/create-notification`,
        method : 'post'
    },
    categoryProduct : {
        url : `${backendDomain}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomain}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomain}/api/product-details`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomain}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomain}/api/filter-product`,
        method : 'post'
    },
    createBlog : {
        url : `${backendDomain}/api/create-blog`,
        method : 'post'
    },
    getBlogs : {
        url : `${backendDomain}/api/get-blogs`,
        method : 'get'
    },
    updateBlog : {
        url : `${backendDomain}/api/update-blog`,
        method : 'put'
    },
    deleteBlog : {
        url : `${backendDomain}/api/delete-blog`,
        method : 'delete'
    },
    
    submitReport: {
        url: `${backendDomain}/api/submit-report`,
        method: "POST"
    },    
   
    getReports: {
        url: `${backendDomain}/api/get-reports`,
        method: "GET"
    },
    getAllReports: {
        url: `${backendDomain}/api/all-reports`,
        method: "GET"
    },
        
    replyReport: {
        url: `${backendDomain}/api/reply-report/:id`,
        method: "POST"
    },
    createData : {
        url : `${backendDomain}/api/createdata`,
        method : 'post'
    },
    allData : {
        url : `${backendDomain}/api/alldata`,
        method : 'get'
    },
    adminAllData : {
        url : `${backendDomain}/api/getAllDataForAdmin`,
        method : 'get'
    },
    updateData : {
        url : `${backendDomain}/api/updatedata`,
        method : 'put'
    },
    deleteData : {
        url : `${backendDomain}/api/deletedata`,
        method : 'delete'
    },
    uploadMedia : {
        url : `${backendDomain}/api/upload-media`,
        method : 'post'
    },
    contactUsMessage: {
        url: `${backendDomain}/api/contact-us-message`,
        method: "POST"
    },    
   
    getContactUsMessages: {
        url: `${backendDomain}/api/get-contact-us-messages`,
        method: "GET"
    },
    walletBalance: {
        url: `${backendDomain}/api/wallet/balance`,
        method: 'GET',
      },
      getWalletBalance: {
        url: `${backendDomain}/api/wallet/balane`,
        method: 'GET',
      },
      createPayment: {
        url: `${backendDomain}/api/pr/create`,
        method: 'POST',
      },
      getAllPayment: {
        url: `${backendDomain}/api/pr/getall`,
        method: 'GET',
      },
      getUserPayment: {
        url: `${backendDomain}/api/pr/getuser`,
        method: 'GET',
      },
      updatePayment: {
        url: `${backendDomain}/api/pr/update`,
        method: 'PATCH',
      },
      addBankAccount: {
        url: `${backendDomain}/api/ba/add`,
        method: 'POST',
      },
      getBankAccounts: {
        url: `${backendDomain}/api/ba/get`,
        method: 'GET',
      },
      deleteBankAccount: {
        url: `${backendDomain}/api/ba/delete`,
        method: 'DELETE',
      },
      transactions: {
        url: `${backendDomain}/api/transactions/get`,
        method: 'GET',
      },
      getTransactionNotifications: {
        url: `${backendDomain}/api/tr-notifications/get`,
        method: 'GET',
      },
      markNotificationAsRead: {
        url: `${backendDomain}/api/tr-notifications/read`, 
        method: 'PATCH',
    },
    deleteNotification: {
        url: `${backendDomain}/api/tr-notifications/delete`, 
        method: 'DELETE',
    },
    markAllNotificationsAsRead: {
        url: `${backendDomain}/api/tr-notifications/read-all`,
        method: 'PUT',
    },
    deleteAllNotifications: {
        url: `${backendDomain}/api/tr-notifications/all`,
        method: 'DELETE',
    },
    getReportNotifications: {
        url: `${backendDomain}/api/report/notifications`,
        method: 'GET',
      },
      fetchReportDetails: {
        url: `${backendDomain}/api/notifications/report-details`,
        method: 'GET',

    },
    fetchReportDetail: {
        url: `${backendDomain}/api/user-report-details`,
        method: 'GET',
    },
    userReplyReport: {
        url: `${backendDomain}/api/reports/:id/reply`,
        method: "POST",
    },
    getReportChat: {
        url: `${backendDomain}/api/reports/admin/:id/chat`,
        method: "GET",
    },
    sendChatMessage: {
        url: `${backendDomain}/api/reports/admin/:id/sendchat`,
        method: "POST",
    },
 
}

export default SummaryApi;
