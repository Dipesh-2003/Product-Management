package com.aurionpro.app.service;

import com.aurionpro.app.dto.ProductDto;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfExportService {

    public void exportReportAsPdf(OutputStream outputStream, List<ProductDto> products) throws JRException, FileNotFoundException {
        // Find and load the compiled JRXML file
        File file = ResourceUtils.getFile("classpath:reports/products-report.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());

        // This is a wrapper for our List of products
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(products);
        
        // We can pass parameters to the report if needed
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "ProductManagerApp");

        // Fill the report with data
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        
        // Export the report to PDF and write it to the output stream
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
    }
}