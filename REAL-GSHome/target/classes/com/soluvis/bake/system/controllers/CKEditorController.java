package com.soluvis.bake.system.controllers;

import java.io.IOException;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.file.CKEditorUploadResponse;
import com.soluvis.bake.system.domain.file.CommonFile;
import com.soluvis.bake.system.domain.file.CommonFileService;
import com.soluvis.bake.system.domain.file.UploadParameters;

@Controller
@RequestMapping("/ckeditor")
public class CKEditorController extends commController {

    @Inject
    private CommonFileService commonFileService;

    @RequestMapping(value = "/uploadImage", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public CKEditorUploadResponse uploadDragAndDropFromCKEditor(
            @RequestParam(value = "upload") MultipartFile multipartFile,
            @RequestParam(defaultValue = "CKEDITOR", required = false) String targetType,
            @RequestParam String targetId) throws IOException {


        if (StringUtils.isEmpty(multipartFile.getName()) || multipartFile.getBytes().length == 0) {
            throw new IllegalArgumentException("file not presented");
        }

        UploadParameters uploadParameters = new UploadParameters();
        uploadParameters.setMultipartFile(multipartFile);
        uploadParameters.setTargetId(targetId);
        uploadParameters.setTargetType(targetType);
        uploadParameters.setThumbnail(false);

        CommonFile commonFile = commonFileService.upload(uploadParameters);

        CKEditorUploadResponse ckEditorUploadResponse = new CKEditorUploadResponse();
        ckEditorUploadResponse.setFileName(commonFile.getFileNm());
        ckEditorUploadResponse.setUrl(commonFile.preview());

        return ckEditorUploadResponse;
    }

    @RequestMapping(value = "/fileBrowser")
    public String fileBrowser() {
        return "/common/fileBrowser";
    }
}
